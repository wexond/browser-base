import { remote } from 'electron';
import store from '.';

export class ExtensionsStore {
  public emitExtensionEvent(scope: string, name: string, ...data: any[]) {
    const backgroundPages = remote.getGlobal('backgroundPages');

    for (const page of store.pagesStore.pages) {
      if (page.webview && page.webview.getWebContents()) {
        page.webview.send(`api-emit-event-${scope}-${name}`, data);
      }
    }

    Object.keys(backgroundPages).forEach(key => {
      const webContents = remote.webContents.fromId(
        backgroundPages[key].webContentsId,
      );
      webContents.send(`api-emit-event-${scope}-${name}`, ...data);
    });
  }
}
