import { ipcRenderer } from 'electron';
import { IpcExtension } from '../models';
import { Port, API } from '~/extensions';

export const getAPI = (extension: IpcExtension, tabId: number = null) => {
  const api = new API(extension, tabId);

  ipcRenderer.on(
    'api-runtime-connect',
    (e: Electron.IpcMessageEvent, data: any) => {
      const { portId, sender, name } = data;
      const port = new Port(portId, name, sender);
      api.runtime.onConnect.emit(port);
    },
  );

  return api;
};
