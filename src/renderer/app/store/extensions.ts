import { remote } from 'electron';
import store from '.';
import { observable } from 'mobx';
import { BrowserAction } from '@app/models/browser-action';

export class ExtensionsStore {
  @observable
  public browserActions: BrowserAction[] = [];

  public emitEvent(scope: string, name: string, ...data: any[]) {
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

  public getBrowserActionById(id: string) {
    return this.browserActions.find(x => x.extensionId === id);
  }
}
