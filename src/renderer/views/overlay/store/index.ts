import { observable, computed } from 'mobx';

import { getTheme } from '~/utils/themes';

interface IPopupInfo extends browser.overlayPrivate.PopupInfo {
  left?: number;
  top?: number;
}

export class Store {
  @observable
  public popups = new Map<string, IPopupInfo>();

  @observable
  public extensionUrl = 'about:blank';

  public webviewRef: Electron.WebviewTag;

  @computed
  public get theme() {
    return getTheme('wexond-light');
  }

  constructor() {
    this.popups.set('extensionPopup', {
      visible: false,
    });

    browser.overlayPrivate.onPopupUpdated.addListener((name, info) => {
      const popup = this.popups.get(name);
      Object.assign(popup, info);
      if (!info.visible) {
        browser.overlayPrivate.setRegions([]);
      }
    });

    browser.browserActionPrivate.onVisibilityChange.addListener(
      (action, visible) => {
        if (!visible) this.extensionUrl = 'about:blank';
        if (visible) {
          this.extensionUrl = action.popup;
        }
      },
    );
  }
}

export default new Store();
