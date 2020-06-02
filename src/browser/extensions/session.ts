import { session } from 'electron';

export const sessionFromIpcEvent = (
  e: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent,
) => e.sender.session || session.defaultSession;
