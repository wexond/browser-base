import { ipcRenderer } from 'electron';
import { randomId } from '~/common/utils/string';

export class WebRequestEvent {
  private name: string;

  private callbackIdMap: Map<Function, string> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  public addListener(callback: Function, filters: string[] = null) {
    const id = randomId();
    this.callbackIdMap.set(callback, id);

    ipcRenderer.on(id, (e, details, responseId) => {
      const response = callback(details);

      ipcRenderer.send(`${id}-${responseId}`, response);
    });

    ipcRenderer.send('webRequest.addListener', id, this.name, filters);
  }

  public removeListener(callback: Function) {
    if (!this.callbackIdMap.has(callback)) {
      return;
    }

    const id = this.callbackIdMap.get(callback);

    ipcRenderer.removeAllListeners(id);
    ipcRenderer.send(`webRequest.removeListener-${id}`);
  }
}
