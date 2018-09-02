import { ipcRenderer } from 'electron';

import { Manifest } from '@/interfaces/extensions';
import { API } from '~/preloads/api';
import { API_RUNTIME_CONNECT } from '@/constants/extensions';
import { Port } from '@/models/extensions';

export const getAPI = (manifest: Manifest) => {
  const api = new API(manifest);

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
