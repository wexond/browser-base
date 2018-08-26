import { ipcRenderer } from 'electron';

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
  private name: string;
  private listeners: number[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addListener(callback: Function, filters: string[] = null) {
    const id = hashCode(callback.toString());
    this.listeners.push(id);

    ipcRenderer.on(
      `api-webRequest-intercepted-${this.name}-${id}`,
      (e: any, details: any) => {
        const response = callback(details);
        console.log(response);
        ipcRenderer.send(
          `api-webRequest-response-${this.name}-${id}`,
          response,
        );
      },
    );
    ipcRenderer.send(`api-add-webRequest-listener`, {
      id,
      name: this.name,
      filters,
    });
  }

  public removeListener(callback: Function) {
    const id = hashCode(callback.toString());
    this.listeners = this.listeners.filter(c => c !== id);

    ipcRenderer.removeAllListeners(
      `api-webRequest-intercepted-${this.name}-${id}`,
    );

    ipcRenderer.send(`api-remove-webRequest-listener`, { id, name: this.name });
  }
}
