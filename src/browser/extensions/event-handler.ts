import { EventEmitter } from 'events';
import { ipcMain } from 'electron';
import { sessionFromIpcEvent } from './session';
import { webContentsInvoke } from './web-contents';

export interface IEventDetails {
  webContents: Electron.WebContents;
  id: string;
  name?: string;
  session?: Electron.Session;
}

export class EventHandler extends EventEmitter {
  protected scope: string;

  protected events: Map<string, IEventDetails[]> = new Map();

  constructor(scope: string, events: string[]) {
    super();

    this.scope = scope;

    for (const event of events) {
      this.events.set(event, []);
    }

    ipcMain.on(`${scope}.addListener`, (e, id, name, ...args) => {
      const details: IEventDetails = {
        webContents: e.sender,
        id,
        name,
        session: sessionFromIpcEvent(e),
      };
      this.events.get(name).push(details);
      this.emit('addListener', details, ...args);
    });
  }

  public async invokeEvent({ webContents, id }: IEventDetails, ...args: any[]) {
    return await webContentsInvoke(webContents, id, ...args);
  }

  public sendEventToAll(eventName: string, ...args: any[]) {
    this.events
      .get(eventName)
      .forEach((x) => x.webContents.send(x.id, null, ...args));
  }
}
