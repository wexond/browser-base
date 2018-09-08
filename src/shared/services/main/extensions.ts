import { BrowserWindow, ipcMain, webContents } from 'electron';

import * as apiMessages from '@/constants/extensions';
import { Alarm } from '@/interfaces/extensions';
import { Global } from '@/interfaces/main';

declare const global: Global;

export const runExtensionsService = (window: BrowserWindow) => {
  ipcMain.on(apiMessages.API_TABS_QUERY, (e: Electron.IpcMessageEvent) => {
    window.webContents.send(apiMessages.API_TABS_QUERY, e.sender.id);
  });

  ipcMain.on(
    apiMessages.API_TABS_CREATE,
    (e: Electron.IpcMessageEvent, data: chrome.tabs.CreateProperties) => {
      window.webContents.send(apiMessages.API_TABS_CREATE, data, e.sender.id);
    },
  );

  ipcMain.on(
    apiMessages.API_TABS_INSERT_CSS,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
    ) => {
      window.webContents.send(
        apiMessages.API_TABS_INSERT_CSS,
        tabId,
        details,
        e.sender.id,
      );
    },
  );

  ipcMain.on(
    apiMessages.API_TABS_EXECUTE_SCRIPT,
    (
      e: Electron.IpcMessageEvent,
      tabId: number,
      details: chrome.tabs.InjectDetails,
    ) => {
      window.webContents.send(
        apiMessages.API_TABS_EXECUTE_SCRIPT,
        tabId,
        details,
        e.sender.id,
      );
    },
  );

  ipcMain.on(
    apiMessages.API_RUNTIME_RELOAD,
    (e: Electron.IpcMessageEvent, extensionId: string) => {
      if (global.backgroundPages[extensionId]) {
        const contents = webContents.fromId(e.sender.id);
        contents.reload();
      }
    },
  );

  ipcMain.on(
    apiMessages.API_RUNTIME_CONNECT,
    async (e: Electron.IpcMessageEvent, data: any) => {
      const { extensionId, portId, sender, name } = data;
      const bgPage = global.backgroundPages[extensionId];

      if (e.sender.id !== bgPage.webContentsId) {
        window.webContents.send(apiMessages.API_RUNTIME_CONNECT, {
          bgPageId: bgPage.webContentsId,
          portId,
          sender,
          name,
          webContentsId: e.sender.id,
        });
      }
    },
  );

  ipcMain.on(
    apiMessages.API_PORT_POSTMESSAGE,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { portId, msg } = data;

      Object.keys(global.backgroundPages).forEach(key => {
        const bgPage = global.backgroundPages[key];
        if (e.sender.id !== bgPage.webContentsId) {
          const contents = webContents.fromId(bgPage.webContentsId);
          contents.send(apiMessages.API_PORT_POSTMESSAGE + portId, msg);
        }
      });

      window.webContents.send(apiMessages.API_PORT_POSTMESSAGE, {
        portId,
        msg,
        senderId: e.sender.id,
      });
    },
  );

  ipcMain.on(
    apiMessages.API_STORAGE_OPERATION,
    (e: Electron.IpcMessageEvent, data: any) => {
      const contents = webContents.fromId(e.sender.id);
      const storage = global.databases[data.extensionId];
      const msg = apiMessages.API_STORAGE_OPERATION + data.id;

      if (data.type === 'get') {
        storage[data.area].get(data.arg, d => {
          for (const key in d) {
            if (Buffer.isBuffer(d[key])) {
              d[key] = JSON.parse(d[key].toString());
            }
          }
          contents.send(msg, d);
        });
      } else if (data.type === 'set') {
        storage[data.area].set(data.arg, () => {
          contents.send(msg);
        });
      } else if (data.type === 'clear') {
        storage[data.area].clear(() => {
          contents.send(msg);
        });
      } else if (data.type === 'remove') {
        storage[data.area].set(data.arg, () => {
          contents.send(msg);
        });
      }
    },
  );

  ipcMain.on(
    apiMessages.API_ALARMS_OPERATION,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { extensionId, type } = data;
      const contents = webContents.fromId(e.sender.id);

      if (type === 'create') {
        const { name, alarmInfo } = data;
        const alarms = global.extensionsAlarms[extensionId];
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

        global.extensionsAlarms[extensionId].push(alarm);

        if (!alarm.periodInMinutes) {
          setTimeout(() => {
            contents.send(`api-emit-event-alarms-onAlarm`, alarm);
          }, alarm.scheduledTime - Date.now());
        }
      }
    },
  );

  ipcMain.on(
    apiMessages.API_BROWSER_ACTION_SET_BADGE_TEXT,
    (e: Electron.IpcMessageEvent, ...args: any[]) => {
      window.webContents.send(
        apiMessages.API_BROWSER_ACTION_SET_BADGE_TEXT,
        e.sender.id,
        ...args,
      );
    },
  );
};
