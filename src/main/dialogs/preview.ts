import { AppWindow } from '../windows';
import { MENU_WIDTH, TITLEBAR_HEIGHT } from '~/constants/design';
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
        width: appWindow.win.getBounds().width,
        height: HEIGHT,
        y: TITLEBAR_HEIGHT,
      },
      hideTimeout: 150,
    });
  }

  public rearrange() {
    const { width } = this.appWindow.win.getContentBounds();
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

    const { id, url, title, errorURL } = this.appWindow.viewManager.views.get(
      this.tab.id,
    );

    this.send('visible', true, {
      id,
      url: url.startsWith('wexond-error') ? errorURL : url,
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
