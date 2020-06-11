import { observable, computed } from 'mobx';

import { getTheme } from '~/utils/themes';

interface IPopupInfo {
  visible: boolean;
}

export class Store {
  @observable
  public popups = new Map<string, IPopupInfo>();

  @observable
  public extensionUrl = 'about:blank';

  public webviewRef: Electron.WebviewTag;

  public extensionBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  @computed
  public get theme() {
    return getTheme('wexond-light');
  }

  constructor() {
    this.popups.set('extensionPopup', {
      visible: false,
    });

    browser.overlayPrivate.onVisibilityStateChange.addListener(
      (name, visible) => {
        const popup = this.popups.get(name);
        popup.visible = visible;
      },
    );

    browser.browserActionPrivate.onVisibilityChange.addListener(
      (action, visible) => {
        console.log(action);
        if (visible) {
          this.extensionUrl = action.popup;
          this.webviewRef.focus();
        }
      },
    );
  }
}

export default new Store();
