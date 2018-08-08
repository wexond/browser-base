import { ipcRenderer } from 'electron';

/* eslint no-bitwise: 0 */
const hashCode = (str: string) => {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export default class WebRequestEvent {
  private scope: string;

  private name: string;

  private callbacks: Function[] = [];

  private listener: boolean = false;

  constructor(scope: string, name: string) {
    this.scope = scope;
    this.name = name;

    this.emit = this.emit.bind(this);
  }

  public emit(e: Electron.IpcMessageEvent, details: any) {
    this.callbacks.forEach((callback) => {
      console.log(this.name, details);
      ipcRenderer.send(`api-response-${this.scope}-${this.name}`, callback(details));
    });
  }

  public addListener(callback: Function) {
    this.callbacks.push(callback);

    if (!this.listener) {
      ipcRenderer.on(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`api-add-listener-${this.scope}-${this.name}`);
      this.listener = true;
    }
  }

  public removeListener(callback: Function) {
    this.callbacks = this.callbacks.filter((c) => c !== callback);

    if (this.callbacks.length === 0) {
      ipcRenderer.removeListener(`api-emit-event-${this.scope}-${this.name}`, this.emit);
      ipcRenderer.send(`api-remove-listener-${this.scope}-${this.name}`);
      this.listener = false;
    }
  }
}
