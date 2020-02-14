/* eslint @typescript-eslint/camelcase: 0 */

import { observable } from 'mobx';
import { join, resolve } from 'path';

import { IBrowserAction } from '../models';
import { promises } from 'fs';
import { ipcRenderer, remote } from 'electron';
import store from '.';
import { getPath } from '~/utils';
import { EXTENSIONS_PROTOCOL } from '~/constants';
import { format } from 'url';

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

  public async loadExtension(extensionId: string) {
    const path = getPath('extensions', extensionId);
    const manifestPath = resolve(path, 'manifest.json');
    const manifest: chrome.runtime.Manifest = JSON.parse(
      await promises.readFile(manifestPath, 'utf8'),
    );

    if (this.defaultBrowserActions.find(x => x.extensionId === extensionId))
      return;

    if (manifest.browser_action) {
      const { default_icon, default_title } = manifest.browser_action;

      let icon1 = default_icon;

      if (typeof icon1 === 'object') {
        icon1 = Object.values(default_icon)[
          Object.keys(default_icon).length - 1
        ];
      }

      const data = await promises.readFile(join(path, icon1 as string));

      if (this.defaultBrowserActions.find(x => x.extensionId === extensionId))
        return;

      const icon = window.URL.createObjectURL(new Blob([data]));
      const browserAction = new IBrowserAction({
        extensionId: extensionId,
        icon,
        title: default_title,
        popup: manifest?.browser_action?.default_popup
          ? format({
              protocol: EXTENSIONS_PROTOCOL,
              slashes: true,
              hostname: extensionId,
              pathname: manifest.browser_action.default_popup,
            })
          : null,
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
    const extensions = remote.session
      .fromPartition('persist:view')
      .getAllExtensions();

    extensions.forEach(x => this.loadExtension(x.id));
  }
}
