import { ipcRenderer } from 'electron';
import { makeId } from './string';
import store from '~/renderer/app/store';

export const callBrowserViewMethod = (
  scope: string,
  tabId: number = store.tabGroupsStore.currentGroup.selectedTabId,
  ...args: any[]
) => {
  return new Promise((resolve: any) => {
    const callId = makeId(32);
    ipcRenderer.send('browserview-call', {
      args,
      scope,
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
