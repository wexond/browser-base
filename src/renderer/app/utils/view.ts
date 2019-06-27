import { makeId } from '~/shared/utils/string';
import { ipcRenderer } from 'electron';

export const callViewMethod = (
  id: number,
  scope: string,
  ...args: any[]
): Promise<any> => {
  return new Promise(resolve => {
    const callId = makeId(32);
    ipcRenderer.send('browserview-call', {
      args,
      scope,
      tabId: id,
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
