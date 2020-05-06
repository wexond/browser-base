import { session } from 'electron';

let fallbackSession: Electron.Session;

export const _setFallbackSession = (ses: Electron.Session) => {
  fallbackSession = ses;
};

export const sessionFromIpcEvent = (e: Electron.IpcMainEvent) =>
  e.sender.session || fallbackSession || session.defaultSession;
