import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';
import { observable, computed, makeObservable } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export declare interface DialogStore {
  onVisibilityChange: (visible: boolean, ...args: any[]) => void;
  onUpdateTabInfo: (tabId: number, data: any) => void;
  onHide: (data: any) => void;
}

export class DialogStore {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  private _windowId = -1;

  private persistent = false;

  @observable
  public visible = false;

  public firstTime = false;

  public constructor(
    options: {
      hideOnBlur?: boolean;
      visibilityWrapper?: boolean;
      persistent?: boolean;
    } = {},
  ) {
    makeObservable(this, {
      theme: computed,
      settings: observable,
      visible: observable,
    });

    const { visibilityWrapper, hideOnBlur, persistent } = {
      hideOnBlur: true,
      visibilityWrapper: true,
      persistent: false,
      ...options,
    };

    if (!persistent) this.visible = true;

    this.persistent = persistent;

    if (visibilityWrapper && persistent) {
      ipcRenderer.on('visible', async (e, flag, ...args) => {
        this.onVisibilityChange(flag, ...args);
      });
    }

    if (hideOnBlur) {
      window.addEventListener('blur', () => {
        this.hide();
      });
    }

    this.settings = {
      ...this.settings,
      ...ipcRenderer.sendSync('get-settings-sync'),
    };

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });

    ipcRenderer.on('update-tab-info', (e, tabId, data) =>
      this.onUpdateTabInfo(tabId, data),
    );

    this.onHide = () => {};
    this.onUpdateTabInfo = () => {};
    this.onVisibilityChange = () => {};

    this.send('loaded');
  }

  public async invoke(channel: string, ...args: any[]) {
    return await ipcRenderer.invoke(`${channel}-${this.id}`, ...args);
  }

  public async send(channel: string, ...args: any[]) {
    ipcRenderer.send(`${channel}-${this.id}`, ...args);
  }

  public get id() {
    return remote.getCurrentWebContents().id;
  }

  public get windowId() {
    if (this._windowId === -1) {
      const win = remote.getCurrentWindow();
      if (win) this._windowId = win.id;
    }

    return this._windowId;
  }

  public hide(data: any = null) {
    if (this.persistent && !this.visible) return;

    this.visible = false;
    this.onHide(data);

    setTimeout(() => {
      this.send('hide');
    });
  }
}
