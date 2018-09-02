import { ipcRenderer, remote } from 'electron';
import { format } from 'url';
import { readFileSync } from 'fs';
import { join } from 'path';

import { makeId, replaceAll } from '@/utils/strings';
import {
  API_STORAGE_OPERATION,
  API_ALARMS_OPERATION,
  API_RUNTIME_CONNECT,
  API_BROWSER_ACTION_SET_BADGE_TEXT,
} from '@/constants/extensions';
import { Manifest } from '@/interfaces/extensions';
import { IpcEvent, Event, Port, WebRequestEvent } from '@/models/extensions';

export const getAPI = (manifest: Manifest) => {
  // https://developer.chrome.com/extensions
  const api = {
    webNavigation: webNavigation(),
    extension: extension(),
    alarms: alarms(manifest),
    runtime: runtime(manifest),

    // https://developer.chrome.com/extensions/webRequest
    webRequest: {},

    i18n: {},

    browserAction: {
      onClicked: {
        addListener: () => {},
      },
      setIcon: (details: chrome.browserAction.TabIconDetails, cb: any) => {
        if (cb) cb();
      },
      setBadgeBackgroundColor: (
        details: chrome.browserAction.BadgeBackgroundColorDetails,
        cb: any,
      ) => {
        if (cb) cb();
      },
      setBadgeText: (
        details: chrome.browserAction.BadgeTextDetails,
        cb: any,
      ) => {
        ipcRenderer.send(
          API_BROWSER_ACTION_SET_BADGE_TEXT,
          manifest.extensionId,
          details,
        );

        if (cb) {
          ipcRenderer.once(API_BROWSER_ACTION_SET_BADGE_TEXT, () => {
            cb();
          });
        }
      },
    },
  };

  ipcRenderer.on(
    API_RUNTIME_CONNECT,
    (e: Electron.IpcMessageEvent, data: any) => {
      const { portId, sender, name } = data;
      const port = new Port(portId, name, sender);

      api.runtime.onConnect.emit(port);
    },
  );

  return api;
};
