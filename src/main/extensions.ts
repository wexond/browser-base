import {
  webContents,
  app,
  WebContents,
  ipcMain,
  IpcMessageEvent,
} from 'electron';
import * as fs from 'fs';
import { format } from 'url';
import { resolve } from 'path';
import { promisify } from 'util';

import { getPath } from '~/shared/utils/paths';
import { Extension, StorageArea } from './models';
import { IpcExtension } from '~/shared/models';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

export const extensions: { [key: string]: Extension } = {};

export const getIpcExtension = (id: string): IpcExtension => {
  const ipcExtension: Extension = {
    ...extensions[id],
  };

  delete ipcExtension.databases;

  return ipcExtension;
};

export const startBackgroundPage = async (extension: Extension) => {
  const { manifest, path, id } = extension;

  if (manifest.background) {
    const { background } = manifest;
    const { page, scripts } = background;

    let html = Buffer.from('');
    let fileName: string;

    if (page) {
      fileName = page;
      html = await readFile(resolve(path, page));
    } else if (scripts) {
      fileName = 'generated.html';
      html = Buffer.from(
        `<html>
          <body>${scripts
            .map(script => `<script src="${script}"></script>`)
            .join('')}
          </body>
        </html>`,
        'utf8',
      );
    }

    const contents: WebContents = (webContents as any).create({
      partition: 'persist:wexond_extension',
      isBackgroundPage: true,
      commandLineSwitches: ['--background-page'],
      preload: `${app.getAppPath()}/build/background-preload.js`,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        contextIsolation: false,
      },
    });

    extension.backgroundPage = {
      html,
      fileName,
      webContentsId: contents.id,
    };

    contents.openDevTools({ mode: 'detach' });

    contents.loadURL(
      format({
        protocol: 'wexond-extension',
        slashes: true,
        hostname: id,
        pathname: fileName,
      }),
    );
  }
};

export const loadExtensions = async () => {
  const extensionsPath = getPath('extensions');
  const files = await readdir(extensionsPath);

  for (const dir of files) {
    const extensionPath = resolve(extensionsPath, dir);
    const stats = await stat(extensionPath);

    if (stats.isDirectory()) {
      const manifestPath = resolve(extensionPath, 'manifest.json');

      if (await exists(manifestPath)) {
        const manifest: chrome.runtime.Manifest = JSON.parse(
          await readFile(manifestPath, 'utf8'),
        );

        const id = dir.toLowerCase();

        if (extensions[id]) {
          return;
        }

        const storagePath = getPath('storage/extensions', id);
        const local = new StorageArea(resolve(storagePath, 'local'));
        const sync = new StorageArea(resolve(storagePath, 'sync'));
        const managed = new StorageArea(resolve(storagePath, 'managed'));

        const extension: Extension = {
          manifest,
          alarms: [],
          databases: { local, sync, managed },
          path: extensionPath,
          id,
        };

        extensions[id] = extension;

        if (typeof manifest.default_locale === 'string') {
          const defaultLocalePath = resolve(
            extensionPath,
            '_locales',
            manifest.default_locale,
          );

          if (await exists(defaultLocalePath)) {
            const messagesPath = resolve(defaultLocalePath, 'messages.json');
            const stats = await stat(messagesPath);

            if ((await exists(messagesPath)) && !stats.isDirectory()) {
              const data = await readFile(messagesPath, 'utf8');
              const locale = JSON.parse(data);

              extension.locale = locale;
            }
          }
        }

        startBackgroundPage(extension);
      }
    }
  }
};

ipcMain.on('get-extension', (e: IpcMessageEvent, id: string) => {
  e.returnValue = getIpcExtension(id);
});

ipcMain.on('get-extensions', (e: IpcMessageEvent) => {
  const list = { ...extensions };

  for (const key in list) {
    list[key] = getIpcExtension(key);
  }

  e.returnValue = list;
});
