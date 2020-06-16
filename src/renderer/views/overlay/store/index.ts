import { observable, computed, observe } from 'mobx';

import { getTheme } from '~/utils/themes';
import { IRectangle } from '~/interfaces';

interface IPopupInfo extends browser.overlayPrivate.PopupInfo {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
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

  public updateRegions() {
    const regions: number[][] = [];
    for (const { left, top, width, height, visible } of Array.from(
      this.popups.values(),
    )) {
      if (visible) {
        regions.push([left, top, width, height]);
      }
    }
    browser.overlayPrivate.setRegions(regions);
  }

  public setPopupBounds(
    name: string,
    bounds: { left?: number; top?: number; width?: number; height?: number },
  ) {
    const popup = this.popups.get(name);
    Object.assign(popup, bounds);

    this.updateRegions();
  }
}

export default new Store();
