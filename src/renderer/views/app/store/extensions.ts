/* eslint @typescript-eslint/camelcase: 0 */

import { action, makeObservable, observable } from 'mobx';
import { join } from 'path';

import { IBrowserAction } from '../models';
import { promises } from 'fs';
import { ipcRenderer } from 'electron';
import store from '.';
import { extensionMainChannel } from '~/common/rpc/extensions';

export class ExtensionsStore {
  public browserActions: IBrowserAction[] = [];

  public defaultBrowserActions: IBrowserAction[] = [];

  public currentlyToggledPopup = '';

  public constructor() {
    makeObservable(this, {
      browserActions: observable,
      defaultBrowserActions: observable,
      currentlyToggledPopup: observable,
      uninstallExtension: action,
    });

    this.load();

    ipcRenderer.on('load-browserAction', async (e, extension) => {
      await this.loadExtension(extension);
    });
  }

  public addBrowserActionToTab(tabId: number, browserAction: IBrowserAction) {
    const tabBrowserAction: IBrowserAction = Object.assign(
      Object.create(Object.getPrototypeOf(browserAction)),
      browserAction,
    );
    tabBrowserAction.tabId = tabId;
    this.browserActions.push(tabBrowserAction);
  }

  public async loadExtension(extension: Electron.Extension) {
    if (this.defaultBrowserActions.find((x) => x.extensionId === extension.id))
      return;

    if (extension.manifest.browser_action) {
      const { default_icon, default_title } = extension.manifest.browser_action;

      let icon1 = default_icon;

      if (typeof icon1 === 'object') {
        icon1 = Object.values(default_icon)[
          Object.keys(default_icon).length - 1
        ];
      }

      const data = await promises.readFile(
        join(extension.path, icon1 as string),
      );

      if (
        this.defaultBrowserActions.find((x) => x.extensionId === extension.id)
      )
        return;

      const icon = window.URL.createObjectURL(new Blob([data]));
      const browserAction = new IBrowserAction({
        extensionId: extension.id,
        icon,
        title: default_title,
        popup: extension.manifest?.browser_action?.default_popup,
      });

      this.defaultBrowserActions.push(browserAction);

      for (const tab of store.tabs.list) {
        this.addBrowserActionToTab(tab.id, browserAction);
      }
    }
  }

  public async load() {
    if (!process.env.ENABLE_EXTENSIONS) return;

    const extensions: Electron.Extension[] = await ipcRenderer.invoke(
      'get-extensions',
    );

    await Promise.all(extensions.map((x) => this.loadExtension(x)));
  }

  uninstallExtension(id: string) {
    this.browserActions = this.browserActions.filter(
      (x) => x.extensionId !== id,
    );
    this.defaultBrowserActions = this.defaultBrowserActions.filter(
      (x) => x.extensionId !== id,
    );

    extensionMainChannel.getInvoker().uninstall(id);
  }
}
