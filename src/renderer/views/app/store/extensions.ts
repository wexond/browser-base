/* eslint @typescript-eslint/camelcase: 0 */

import { observable } from 'mobx';
import { join } from 'path';

import { IBrowserAction } from '../models';
import { extensionsRenderer } from 'electron-extensions/renderer';
import { promises } from 'fs';
import { IpcExtension } from 'electron-extensions/models/ipc-extension';
import { ipcRenderer } from 'electron';
import store from '.';

export class ExtensionsStore {
  @observable
  public browserActions: IBrowserAction[] = [];

  @observable
  public defaultBrowserActions: IBrowserAction[] = [];

  public constructor() {
    this.load();

    ipcRenderer.on('load-browserAction', (e, extension) => {
      this.loadExtension(extension);
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

  public async loadExtension(extension: IpcExtension) {
    const { manifest, path, id, popupPage } = extension;

    if (this.defaultBrowserActions.find(x => x.extensionId === id)) return;

    if (manifest.browser_action) {
      const { default_icon, default_title } = manifest.browser_action;

      let icon1 = default_icon;

      if (typeof icon1 === 'object') {
        icon1 = Object.values(default_icon)[
          Object.keys(default_icon).length - 1
        ];
      }

      const data = await promises.readFile(join(path, icon1 as string));

      if (this.defaultBrowserActions.find(x => x.extensionId === id)) return;

      const icon = window.URL.createObjectURL(new Blob([data]));
      const browserAction = new IBrowserAction({
        extensionId: id,
        icon,
        title: default_title,
        popup: popupPage,
      });

      this.defaultBrowserActions.push(browserAction);

      for (const tab of store.tabs.list) {
        const tabBrowserAction = { ...browserAction };
        tabBrowserAction.tabId = tab.id;
        this.browserActions.push(tabBrowserAction);
      }
    }
  }

  public async load() {
    const extensions = extensionsRenderer.getExtensions();

    for (const key in extensions) {
      this.loadExtension(extensions[key]);
    }
  }
}
