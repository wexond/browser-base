import { ipcRenderer } from 'electron';
import { UPDATE_CHECK, UPDATE_AVAILABLE } from '@/constants/ipc-messages';
import store from '@app/store';

export const runAutoUpdaterService = () => {
  ipcRenderer.send(UPDATE_CHECK);

  ipcRenderer.on(
    UPDATE_AVAILABLE,
    (e: Electron.IpcMessageEvent, version: string) => {
      store.updateInfo.version = version;
      store.updateInfo.available = true;
    },
  );
};
