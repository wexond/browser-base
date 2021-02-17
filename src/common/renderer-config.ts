import { configure } from 'mobx';
import { setIpcRenderer } from '@wexond/rpc-electron';
import { ipcRenderer } from 'electron';

export const configureUI = () => {
  configure({ enforceActions: 'never' });
};

export const configureRenderer = () => {
  setIpcRenderer(ipcRenderer);
};
