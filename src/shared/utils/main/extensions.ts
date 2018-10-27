import { webContents, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import { format } from 'url';
import { resolve } from 'path';
import { promisify } from 'util';

import { Global } from '@/interfaces/main';
import { Manifest } from '@/interfaces/extensions';
import { getPath } from '@/utils/paths';
import { defaultPaths } from '@/constants/paths';
import { StorageArea } from '@/models/main';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

declare const global: Global;

export const startBackgroundPage = async (manifest: Manifest) => {
  if (manifest.background) {
    const { background, extensionId } = manifest;
    const { page, scripts } = background;
    const { srcDirectory } = manifest;

    let html = Buffer.from('');
    let name;

    if (page) {
      name = page;
      html = await readFile(resolve(srcDirectory, page));
    } else if (scripts) {
      name = 'generated.html';
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

    // The create method doesn't exist in the WebContents type.
    const contents = (webContents as any).create({
      partition: 'persist:wexond_extension',
      isBackgroundPage: true,
      commandLineSwitches: ['--background-page'],
      preload: resolve(__dirname, 'build/background-page-preload.js'),
      webPreferences: {
        webSecurity: false,
      },
    });

    global.backgroundPages[extensionId] = {
      html,
      name,
      webContentsId: contents.id,
    };

    contents.openDevTools({ mode: 'detach' });

    contents.loadURL(
      format({
        protocol: 'wexond-extension',
        slashes: true,
        hostname: extensionId,
        pathname: name,
      }),
      {
        userAgent: global.userAgent,
      },
    );
  }
};

export const loadExtensions = async (window: BrowserWindow) => {
  const extensionsPath = getPath('extensions');
  const files = await readdir(extensionsPath);

  for (const dir of files) {
    const extensionPath = resolve(extensionsPath, dir);
    const stats = await stat(extensionPath);

    if (stats.isDirectory()) {
      const manifestPath = resolve(extensionPath, 'manifest.json');

      if (await exists(manifestPath)) {
        const manifest: Manifest = JSON.parse(
          await readFile(manifestPath, 'utf8'),
        );

        manifest.extensionId = dir;
        manifest.srcDirectory = extensionPath;
        manifest.default_locale = manifest.default_locale;

        const id = dir;

        if (global.extensions[id]) {
          return;
        }

        global.extensions[id] = manifest;

        const extensionStoragePath = getPath(
          defaultPaths.extensionsStorage,
          id,
        );

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
              global.extensionsLocales[id] = locale;
            }
          }
        }

        const local = new StorageArea(resolve(extensionStoragePath, 'local'));
        const sync = new StorageArea(resolve(extensionStoragePath, 'sync'));
        const managed = new StorageArea(
          resolve(extensionStoragePath, 'managed'),
        );

        global.databases[manifest.extensionId] = { local, sync, managed };
        global.extensionsAlarms[manifest.extensionId] = [];

        startBackgroundPage(manifest);
      }
    }
  }
};

export const getTabByWebContentsId = async (
  window: BrowserWindow,
  webContentsId: number,
) => {
  return new Promise((resolve: (a: any) => void) => {
    window.webContents.send('get-tab-by-web-contents-id', webContentsId);

    ipcMain.once('get-tab-by-web-contents-id', (e: any, tab: any) => {
      resolve(tab);
    });
  });
};
