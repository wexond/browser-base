import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import { resolve } from 'path';
import * as fs from 'fs';

import { BrowserAction } from '../models';

export class ExtensionsStore {
  @observable
  public browserActions: BrowserAction[] = [];

  @observable
  public defaultBrowserActions: BrowserAction[] = [];

  constructor() {
    this.load();
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

  public load() {
    /*
    TODO: 
    const extensions = ipcRenderer.sendSync('get-extensions');

    for (const key in extensions) {
      const { manifest, path, id } = extensions[key];

      if (manifest.browser_action) {
        const {
          default_icon,
          default_title,
          default_popup,
        } = manifest.browser_action;

        let icon1 = default_icon;

        if (typeof icon1 === 'object') {
          icon1 = Object.keys(default_icon)[
            Object.keys(default_icon).length - 1
          ];
        }

        const data = fs.readFileSync(resolve(path, icon1));
        const icon = window.URL.createObjectURL(new Blob([data]));
        const browserAction = new BrowserAction({
          extensionId: id,
          icon,
          title: default_title,
          popup: default_popup,
        });

        this.defaultBrowserActions.push(browserAction);
      }
    }*/
  }
}
