import { ipcRenderer } from 'electron';
import { ipcInvoker } from '../extensions/ipc-invoker';
import { IpcEvent } from '../extensions/ipc-event';
import { getChromeAPI } from '../extensions/api';

export const getWexondAPI = () => {
  const api = {
    ...getChromeAPI(),
    ipcRenderer,
    browserAction: {
      getAllInTab: ipcInvoker('browserAction.getAllInTab'),
      showPopup: ipcInvoker('browserAction.showPopup'),
      onUpdated: new IpcEvent('browserAction.onUpdated'),
    },
  };

  api.tabs = {
    ...api.tabs,
    stop: ipcInvoker('tabs.stop'),
    getNavigationState: ipcInvoker('tabs.getNavigationState'),
  };

  return api;
};
