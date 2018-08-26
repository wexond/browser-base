import { ipcRenderer } from 'electron';

export default class IpcEvent {
  private scope: string;
  private name: string;
  private callbacks: Function[] = [];
  private listener: boolean = false;

  constructor(scope: string, name: string) {
    this.name = name;
    this.scope = scope;

    this.emit = this.emit.bind(this);
  }

  public emit(e: Electron.IpcMessageEvent, ...args: any[]) {
    this.callbacks.forEach(callback => {
      callback(...args);
    });
  }

  public addListener(callback: Function) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = true;
    }
  }

  public removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter(x => x !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(
        `api-emit-event-${this.scope}-${this.name}`,
        this.emit,
      );
      this.listener = false;
    }
  }
}
