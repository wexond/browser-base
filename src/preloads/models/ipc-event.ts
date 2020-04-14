import { ipcRenderer } from 'electron';
import { hashCode } from '~/utils/string';

export class IpcEvent {
  private scope: string;
  private name: string;
  private callbacks: Function[] = [];
  private listener = false;

  constructor(scope: string, name: string) {
    this.name = name;
    this.scope = scope;

    this.emit = this.emit.bind(this);
  }

  public emit = (e: any, ...args: any[]) => {
    this.callbacks.forEach((callback) => {
      callback(...args);
    });
  };

  public addListener(callback: Function) {
    this.callbacks.push(callback);

    const id = hashCode(callback.toString());
    ipcRenderer.send(`api-addListener`, {
      scope: this.scope,
      name: this.name,
      id,
    });

    if (!this.listener) {
      ipcRenderer.on(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      this.listener = true;
    }
  }

  public removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter((x) => x !== callback);

    const id = hashCode(callback.toString());
    ipcRenderer.send(`api-removeListener`, {
      scope: this.scope,
      name: this.name,
      id,
    });

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(
        `api-emit-event-${this.scope}-${this.name}`,
        this.emit,
      );
      this.listener = false;
    }
  }
}
