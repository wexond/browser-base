import { ipcMain } from 'electron';
import { sessionFromIpcEvent } from './session';

interface IOptions {
  sender?: boolean;
  session?: boolean;
}

export class HandlerFactory {
  public static create(scope: string, bind: any) {
    return (name: string, fn: (...args: any[]) => void, options?: IOptions) =>
      ipcMain.handle(`${scope}.${name}`, (...args: any[]) => {
        if (!options) options = {};

        if (options.session === undefined) options.session = true;

        const [e, ...rest] = args;

        const newArgs = [...rest];

        if (options.sender) newArgs.splice(0, 0, e.sender);
        if (options.session) newArgs.splice(0, 0, sessionFromIpcEvent(e));

        return fn.bind(bind)(...newArgs);
      });
  }
}
