import { ipcRenderer } from 'electron';
import { IpcEvent } from './models/ipc-event';

chrome.browserAction = {
  onClicked: new IpcEvent('browserAction', 'onClicked', sessionId),

  setIcon: (details: chrome.browserAction.TabIconDetails, cb: any) => {
    if (cb) cb();
  },

  setBadgeBackgroundColor: (details: any, cb: any) => {
    if (cb) cb();
  },

  setBadgeText: async (details: any, cb: any) => {
    await ipcRenderer.invoke(
      `api-browserAction-setBadgeText-${sessionId}`,
      chrome.runtime.id,
      details,
    );

    if (cb) {
      cb();
    }
  },
} as any;
