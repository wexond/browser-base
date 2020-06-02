import { ipcMain } from 'electron';
import { sessionFromIpcEvent } from './session';

interface IOptions {
  sender?: boolean;
  session?: boolean;
}

export class HandlerFactory {
  public static uiToSenderSession: Map<
    Electron.Session,
    Electron.Session
  > = new Map();

  public static create(scope: string, bind: any) {
    return (name: string, fn: (...args: any[]) => void, options?: IOptions) =>
      ipcMain.handle(`${scope}.${name}`, (...args: any[]) => {
        if (!options) options = {};

        if (options.session === undefined) options.session = true;

        const [e, ...rest] = args;

        const newArgs = [...rest];

        if (options.sender) newArgs.splice(0, 0, e.sender);
        if (options.session) {
          let ses = sessionFromIpcEvent(e);
          if (this.uiToSenderSession.has(ses)) {
            ses = this.uiToSenderSession.get(ses);
          }

          newArgs.splice(0, 0, ses);
        }

        return fn.bind(bind)(...newArgs);
      });
  }
}
