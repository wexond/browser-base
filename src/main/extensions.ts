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
import { appWindow } from '.';

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

ipcMain.on('api-tabs-query', (e: Electron.IpcMessageEvent) => {
  appWindow.webContents.send('api-tabs-query', e.sender.id);
});

ipcMain.on(
  'api-tabs-create',
  (e: IpcMessageEvent, data: chrome.tabs.CreateProperties) => {
    appWindow.webContents.send('api-tabs-create', data, e.sender.id);
  },
);

ipcMain.on(
  'api-tabs-insertCSS',
  (e: any, tabId: number, details: chrome.tabs.InjectDetails) => {
    const view = appWindow.viewManager.views[tabId];

    if (view) {
      view.webContents.insertCSS(details.code);
    }
  },
);

ipcMain.on(
  'api-tabs-executeScript',
  (e: IpcMessageEvent, tabId: number, details: chrome.tabs.InjectDetails) => {
    const view = appWindow.viewManager.views[tabId];

    if (view) {
      view.webContents.executeJavaScript(details.code, false, (result: any) => {
        view.webContents.send('api-tabs-executeScript', result);
      });
    }
  },
);

ipcMain.on('api-runtime-reload', (e: IpcMessageEvent, extensionId: string) => {
  const { backgroundPage } = extensions[extensionId];

  if (backgroundPage) {
    const contents = webContents.fromId(e.sender.id);
    contents.reload();
  }
});

ipcMain.on(
  'api-runtime-connect',
  async (e: IpcMessageEvent, { extensionId, portId, sender, name }: any) => {
    const { backgroundPage } = extensions[extensionId];

    if (e.sender.id !== backgroundPage.webContentsId) {
      appWindow.viewManager.sendToAll('api-runtime-connect', {
        bgPageId: backgroundPage.webContentsId,
        portId,
        sender,
        name,
        webContentsId: e.sender.id,
      });
    }
  },
);

ipcMain.on(
  'api-port-postMessage',
  (e: IpcMessageEvent, { portId, msg }: any) => {
    Object.keys(extensions).forEach(key => {
      const { backgroundPage } = extensions[key];

      if (e.sender.id !== backgroundPage.webContentsId) {
        const contents = webContents.fromId(backgroundPage.webContentsId);
        contents.send(`api-port-postMessage-${portId}`, msg);
      }
    });

    appWindow.viewManager.sendToAll('api-port-postMessage', {
      portId,
      msg,
      senderId: e.sender.id,
    });
  },
);

ipcMain.on(
  'api-storage-operation',
  (e: IpcMessageEvent, { extensionId, id, area, type, arg }: any) => {
    const { databases } = extensions[extensionId];

    const contents = webContents.fromId(e.sender.id);
    const msg = `api-storage-operation-${id}`;

    if (type === 'get') {
      databases[area].get(arg, d => {
        for (const key in d) {
          if (Buffer.isBuffer(d[key])) {
            d[key] = JSON.parse(d[key].toString());
          }
        }
        contents.send(msg, d);
      });
    } else if (type === 'set') {
      databases[area].set(arg, () => {
        contents.send(msg);
      });
    } else if (type === 'clear') {
      databases[area].clear(() => {
        contents.send(msg);
      });
    } else if (type === 'remove') {
      databases[area].set(arg, () => {
        contents.send(msg);
      });
    }
  },
);

ipcMain.on('api-alarms-operation', (e: IpcMessageEvent, data: any) => {
  const { extensionId, type } = data;
  const contents = webContents.fromId(e.sender.id);

  if (type === 'create') {
    const extension = extensions[extensionId];
    const { alarms } = extension;

    const { name, alarmInfo } = data;
    const exists = alarms.findIndex(e => e.name === name) !== -1;

    e.returnValue = null;
    if (exists) return;

    let scheduledTime = 0;

    if (alarmInfo.when != null) {
      scheduledTime = alarmInfo.when;
    }

    if (alarmInfo.delayInMinutes != null) {
      if (alarmInfo.delayInMinutes < 1) {
        return console.error(
          `Alarm delay is less than minimum of 1 minutes. In released .crx, alarm "${name}" will fire in approximately 1 minutes.`,
        );
      }

      scheduledTime = Date.now() + alarmInfo.delayInMinutes * 60000;
    }

    const alarm: Alarm = {
      periodInMinutes: alarmInfo.periodInMinutes,
      scheduledTime,
      name,
    };

    alarms.push(alarm);

    if (!alarm.periodInMinutes) {
      setTimeout(() => {
        contents.send('api-emit-event-alarms-onAlarm', alarm);
      }, alarm.scheduledTime - Date.now());
    }
  }
});

ipcMain.on(
  'api-browserAction-setBadgeText',
  (e: IpcMessageEvent, ...args: any[]) => {
    appWindow.webContents.send(
      'api-browserAction-setBadgeText',
      e.sender.id,
      ...args,
    );
  },
);
