import { ipcRenderer } from 'electron';

import { makeId } from '~/utils';
import store from '../store';

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

export const loadURL = (url: string) => {
  const tab = store.tabs.selectedTab;

  if (!tab) {
    store.tabs.addTab({ url, active: true });
  } else {
    tab.url = url;
    tab.callViewMethod('webContents.loadURL', url);
  }

  store.overlay.visible = false;
};
