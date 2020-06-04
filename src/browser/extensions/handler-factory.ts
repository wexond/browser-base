import { ipcMain } from 'electron';
import { sessionFromIpcEvent } from './session';

export interface ISenderDetails {
  session?: Electron.Session;
  sender?: Electron.WebContents;
  scriptPath?: string;
  extensionId?: string;
}

export class HandlerFactory {
  public static uiToSenderSession: Map<
    Electron.Session,
    Electron.Session
  > = new Map();

  public static create(scope: string, bind: any) {
    return (name: string, fn: (...args: any[]) => void) =>
      ipcMain.handle(`${scope}.${name}`, (...args: any[]) => {
        const [e, data] = args;

        const ses = sessionFromIpcEvent(e);

        return fn.bind(bind)(
          {
            ...data.info,
            session: this.uiToSenderSession.has(ses)
              ? this.uiToSenderSession.get(ses)
              : ses,
            sender: e.sender,
          },
          data.params,
        );
      });
  }
}
