import { remote } from 'electron';
import store from '../store';

export const emitEvent = (scope: string, name: string, ...data: any[]) => {
  const backgroundPages = remote.getGlobal('backgroundPages');

  for (const page of store.pages) {
    page.webview.send(`extension-emit-event-${scope}-${name}`, data);
  }

  for (const backgroundPage of backgroundPages) {
    const webContents = remote.webContents.fromId(backgroundPage.webContentsId);
    webContents.send(`extension-emit-event-${scope}-${name}`, ...data);
  }
};
