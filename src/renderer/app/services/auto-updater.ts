import { ipcRenderer } from 'electron';
import { UPDATE_AVAILABLE } from '../../../constants';
import store from '../store';

export const runAutoUpdaterService = () => {
  ipcRenderer.on(
    UPDATE_AVAILABLE,
    (e: Electron.IpcMessageEvent, version: string) => {
      store.updateInfo.version = version;
      store.updateInfo.available = true;
    },
  );
};
