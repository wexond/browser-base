import { AppWindow } from '../windows';
import { MENU_WIDTH } from '~/constants/design';
import { Dialog } from '.';
import { TAB_MAX_WIDTH } from '~/renderer/views/app/constants/tabs';

const WIDTH = MENU_WIDTH;
const HEIGHT = 128;

export class PreviewDialog extends Dialog {
  public visible = false;
  public tab: { id?: number; x?: number } = {};

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'preview',
      bounds: {
        width: TAB_MAX_WIDTH + 16,
        height: HEIGHT,
        y: 40,
      },
      hideTimeout: 300,
      devtools: true,
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange();
  }

  public show() {
    this.bounds.x = Math.round(this.tab.x - 8);

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
    });
  }

  public hide() {
    super.hide();
    this.webContents.send('visible', false);
  }
}
