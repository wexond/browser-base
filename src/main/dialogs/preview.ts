import { AppWindow } from '../windows';
import {
  MENU_WIDTH,
  TITLEBAR_HEIGHT,
  DIALOG_MARGIN_TOP,
} from '~/constants/design';
import { Dialog } from '.';

const WIDTH = MENU_WIDTH;
const HEIGHT = 256;

export class PreviewDialog extends Dialog {
  public visible = false;
  public tab: { id?: number; x?: number } = {};

  private timeout1: any;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'preview',
      bounds: {
        width: appWindow.getBounds().width,
        height: HEIGHT,
        y: TITLEBAR_HEIGHT,
      },
      hideTimeout: 150,
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({ width });
  }

  public rearrangeDialogs(toggle: boolean) {
    this.appWindow.dialogs.searchDialog.rearrangePreview(toggle);
    this.appWindow.dialogs.findDialog.rearrangePreview(toggle);
  }

  public async show() {
    clearTimeout(this.timeout1);
    this.rearrangeDialogs(true);

    super.show(false);

    const tab = this.appWindow.viewManager.views.get(this.tab.id);

    const url = tab.webContents.getURL();
    const title = tab.webContents.getTitle();

    this.webContents.send('visible', true, {
      id: tab.id,
      url: url.startsWith('wexond-error') ? tab.errorURL : url,
      title,
      x: Math.round(this.tab.x - 8),
    });
  }

  public hide(bringToTop = true) {
    clearTimeout(this.timeout1);
    this.timeout1 = setTimeout(() => {
      this.rearrangeDialogs(false);
    }, 210);

    super.hide(bringToTop);
  }
}
