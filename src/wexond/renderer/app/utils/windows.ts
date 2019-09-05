import { ipcRenderer, remote } from 'electron';
import store from '~/renderer/app/store';

export const getCurrentWindow = () => remote.getCurrentWindow();

export const closeWindow = () => {
  getCurrentWindow().close();
};

export const minimizeWindow = () => {
  getCurrentWindow().minimize();
};

export const maximizeWindow = () => {
  const currentWindow = getCurrentWindow();

  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
  } else {
    currentWindow.maximize();
  }
};

export function backToFlowr() {
  const param = new URLSearchParams(location.search);
  if (param.has('clearBrowsingDataAtClose')) {
    store.history.clear();
    ipcRenderer.send('clear-browsing-data');
  }
  ipcRenderer.send('open-flowr')
}
