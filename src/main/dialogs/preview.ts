import { AppWindow } from '../windows';
import { MENU_WIDTH } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = MENU_WIDTH;
const HEIGHT = 128;

export class PreviewDialog extends Dialog {
  public visible = false;
  public tab: { id?: number; x?: number } = {};

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'preview',
      bounds: {
        width: appWindow.getBounds().width,
        height: HEIGHT,
        y: 40,
      },
      hideTimeout: 300,
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({ width });
  }

  public show() {
    if (this.appWindow.searchDialog.visible) {
      return;
    }

    super.show();

    const tab = this.appWindow.viewManager.views.find(
      x => x.webContents.id === this.tab.id,
    );

    const url = tab.webContents.getURL();
    const title = tab.webContents.getTitle();

    this.webContents.send('visible', true, {
      id: tab.id,
      url: url.startsWith('wexond-error') ? tab.errorURL : url,
      title,
      x: Math.round(this.tab.x - 8),
    });
  }

  public hide() {
    super.hide();
    this.webContents.send('visible', false);
  }
}
