import { ipcRenderer } from 'electron';
import { makeId } from './string';

export const callBrowserViewMethod = (
  tabId: number,
  method: string,
  ...args: any[]
) => {
  return new Promise((resolve: any) => {
    const callId = makeId(32);
    ipcRenderer.send('browserview-call', {
      args,
      method,
      tabId,
      callId,
    });

    ipcRenderer.once(
      `browserview-call-result-${callId}`,
      (e: any, result: any) => {
        resolve(result);
      },
    );
  });
};
