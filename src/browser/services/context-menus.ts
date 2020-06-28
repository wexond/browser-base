import { BrowserWindow, webContents, ipcMain } from 'electron';
import { Application } from '../application';
import { randomId } from '~/common/utils/string';

export interface IMenuItem {
  id?: string;
  title?: string;
  submenu?: IMenuItem[];
  enabled?: boolean;
  accelerator?: string;
  icon?: string;
  type?: 'normal' | 'separator' | 'toggle';
  parentId?: string;
  onClick?: (menuItem: IMenuItem, window: BrowserWindow) => void;
}

interface IPopupOptions {
  x?: number;
  y?: number;
  window?: BrowserWindow;
}

export class ContextMenusService {
  private menuItems: Map<string, IMenuItem> = new Map();

  constructor() {
    ipcMain.on('menu-click', (e, uid) => {
      const item = this.menuItems.get(uid);
      if (!item) return;

      if (item.onClick) {
        item.onClick(item, BrowserWindow.fromWebContents(e.sender));
      }
    });
  }

  public processMenuItems(menuItems: IMenuItem[]) {
    const items: IMenuItem[] = [];

    for (const item of menuItems) {
      if (!item.id) item.id = randomId();
      if (this.menuItems.has(item.id))
        throw new Error('Duplicate menu item id.');

      this.menuItems.set(item.id, item);

      const newItem: any = { ...item };
      newItem.onClick = true;

      if (Array.isArray(item.submenu))
        newItem.submenu = this.processMenuItems(item.submenu);

      items.push(newItem);
    }

    return items;
  }

  public popup(menuItems: IMenuItem[], options?: IPopupOptions) {
    if (!options) options = {};

    const { window } = options;
    let { x, y } = options;

    if (!x && y) throw new Error(`'x' must be declared when 'y' is present.`);
    if (!y && x) throw new Error(`'y' must be declared when 'x' is present.`);

    const wc = window
      ? window.webContents
      : webContents.getFocusedWebContents();

    const overlay = Application.instance.overlay.fromWebContents(wc);

    if (!overlay) throw new Error('Invalid window.');

    if (!x && !y) {
      const point = overlay.getCursorPoint();
      x = point[0];
      y = point[1];
    }

    this.menuItems.clear();

    const items = this.processMenuItems(menuItems);

    overlay.win.focus();
    overlay.send('menu-popup', items, x, y);
  }
}
