import { ipcRenderer } from 'electron';

export class IpcEvent {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public addListener(callback: any) {
    ipcRenderer.addListener(this.name, (e, ...args) => {
      callback(...args);
    });
  }

  public removeListener(callback: any) {
    ipcRenderer.removeListener(this.name, callback);
  }
}
