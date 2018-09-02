import { remote } from 'electron';
import { observable } from 'mobx';
import { resolve } from 'path';
import fs from 'fs';
import { promisify } from 'util';

import store from '.';
import { BrowserAction } from '@/models/app';

const readFile = promisify(fs.readFile);

export class ExtensionsStore {
  @observable
  public defaultBrowserActions: BrowserAction[] = [];

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

  public queryBrowserAction(query: any) {
    const readProperty = (obj: any, prop: string) => obj[prop];

    return this.browserActions.filter(item => {
      for (const key in query) {
        const itemProp = readProperty(item, key);
        const queryInfoProp = readProperty(query, key);

        if (itemProp == null || queryInfoProp !== itemProp) {
          return false;
        }
      }

      return true;
    });
  }

  public async load() {
    const extensions = remote.getGlobal('extensions');

    for (const key in extensions) {
      const manifest = extensions[key];
      if (manifest.browser_action) {
        const {
          default_icon,
          default_title,
          default_popup,
        } = manifest.browser_action;
        const path = resolve(manifest.srcDirectory, default_icon['32']);

        const data = await readFile(path);
        const icon = window.URL.createObjectURL(new Blob([data]));
        const browserAction = new BrowserAction({
          extensionId: manifest.extensionId,
          icon,
          title: default_title,
          popup: default_popup,
        });

        store.extensionsStore.defaultBrowserActions.push(browserAction);
      }
    }
  }
}
