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

    // https://developer.chrome.com/extensions/i18n
    i18n: {
      getAcceptLanguages: (cb: any) => {
        if (cb) {
          cb(navigator.languages);
        }
      },
      getMessage: (messageName: string, substitutions?: any) => {
        if (messageName === '@@ui_locale') return 'en_US';

        const { extensionId } = manifest;
        const locale = remote.getGlobal('extensionsLocales')[extensionId];
        const substitutionsArray = substitutions instanceof Array;

        const item = locale[messageName];

        if (item == null) return '';
        if (substitutionsArray && substitutions.length >= 9) return null;

        let message = item.message;

        if (typeof item.placeholders === 'object') {
          for (const placeholder in item.placeholders) {
            message = replaceAll(
              message,
              `$${placeholder}$`,
              item.placeholders[placeholder].content,
            );
          }
        }

        if (substitutionsArray) {
          for (let i = 0; i < 9; i++) {
            message = replaceAll(message, `$${i + 1}`, substitutions[i] || ' ');
          }
        }

        return message;
      },
      getUILanguage: () => {
        return navigator.language;
      },
      detectLanguage: (text: string, cb: any) => {
        // TODO
        if (cb) {
          cb({
            isReliable: false,
            languages: [],
          });
        }
      },
    },

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
