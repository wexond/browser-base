import { observable, computed, observe, action } from 'mobx';

import { getTheme } from '~/utils/themes';
import { IMenuItem } from '~/browser/services/context-menus';
import { randomId } from '~/common/utils/string';

interface IRegion {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  visible?: boolean;
}

export interface IMenu {
  id?: string;
  menuItems?: IMenuItem[];
  x?: number;
  y?: number;
  forceRight?: number;
  main?: boolean;
  parentId?: string;
  childId?: string;
}

export class Store {
  @observable
  public regions = new Map<string, IRegion>();

  @observable
  public menus: IMenu[] = [];

  public webviewRef: Electron.WebviewTag;

  public lastFocus: any;

  @observable
  public extensionPopupInfo = {
    url: 'about:blank',
    baseX: 0,
    baseY: 0,
    visible: false,
  };

  @computed
  public get theme() {
    return getTheme('wexond-light');
  }

  constructor() {
    browser.ipcRenderer.on('menu-popup', (e, menuItems, x, y, forceRight) => {
      const id = randomId();

      this.lastFocus = document.activeElement;

      this.menus = [
        {
          menuItems,
          x,
          y,
          id,
          forceRight,
          main: true,
        },
      ];

      document.getElementById('menus').focus();
    });

    browser.ipcRenderer.on('extensionPopup-show', (e, x, y) => {
      this.extensionPopupInfo.baseX = x;
      this.extensionPopupInfo.baseY = y;
    });

    browser.overlayPrivate.onPopupToggled.addListener((name, visible) => {
      this.updateRegion(name, { visible });
    });

    browser.browserActionPrivate.onVisibilityChange.addListener(
      (action, visible) => {
        this.extensionPopupInfo.url = visible ? action.popup : 'about:blank';
      },
    );

    browser.overlayPrivate.onBlur.addListener(() => {
      this.closeMenu();
      this.closeExtensionPopup();
    });
  }

  @action
  public getRegion(name: string) {
    if (!this.regions.has(name)) {
      this.regions.set(name, {});
    }
    return this.regions.get(name);
  }

  public removeRegion(name: string) {
    this.regions.delete(name);
    this.updateRegions();
  }

  public updateRegions() {
    const regions: number[][] = [];
    for (const { left, top, width, height, visible } of Array.from(
      this.regions.values(),
    )) {
      if (visible) {
        regions.push([left, top, width, height]);
      }
    }
    browser.overlayPrivate.setRegions(regions);
  }

  public updateRegion(name: string, info: IRegion) {
    const region = this.getRegion(name);
    Object.assign(region, info);

    this.updateRegions();
  }

  public removeMenu(id: string) {
    const index = this.menus.findIndex((x) => x.id === id);
    if (index === -1) return;

    if (this.menus[index].childId) this.removeMenu(this.menus[index].childId);

    if (this.menus[index].parentId)
      delete this.menus.find((x) => x.id === this.menus[index].parentId)
        ?.childId;

    this.menus.splice(index, 1);
    this.removeRegion(id);
  }

  public closeMenu() {
    for (const menu of this.menus) {
      this.removeRegion(menu.id);
    }
    this.menus = [];

    if (this.lastFocus) this.lastFocus.focus();

    this.lastFocus = null;
  }

  public closeExtensionPopup() {
    if (this.menus.length > 0 || this.webviewRef.isDevToolsOpened()) return;

    this.extensionPopupInfo.url = 'about:blank';
    this.extensionPopupInfo.visible = false;
    this.webviewRef.blur();

    browser.overlayPrivate.setPopupVisible('extensionPopup', false);
  }
}

export default new Store();
