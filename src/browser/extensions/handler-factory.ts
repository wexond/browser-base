import { ipcMain } from 'electron';

export class HandlerFactory {
  public static create(scope: string, bind: any) {
    return (name: string, fn: (...args: any[]) => void, includeEvent = false) =>
      ipcMain.handle(`${scope}.${name}`, (...args: any[]) => {
        if (!includeEvent) args = args.slice(1);
        return fn.bind(bind)(...args);
      });
  }
}
