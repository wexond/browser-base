import { ipcRenderer } from 'electron';
import { getCurrentWindow } from '../../app/utils/windows';

export class Store {
  public windowId: number = ipcRenderer.sendSync(
    `get-window-id-${getCurrentWindow().id}`,
  );

  public constructor() {}
}

export default new Store();
