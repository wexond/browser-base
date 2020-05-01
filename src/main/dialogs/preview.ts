import { BrowserWindow } from 'electron';
import { Application } from '../application';
import {
  DIALOG_MARGIN_TOP,
  DIALOG_MARGIN,
  TITLEBAR_HEIGHT,
} from '~/constants/design';
import { PersistentDialog } from './dialog';

const HEIGHT = 256;

export class PreviewDialog extends PersistentDialog {
  public visible = false;
  public tab: { id?: number; x?: number } = {};

  constructor() {
    super({
      name: 'preview',
      bounds: {
        height: HEIGHT,
        y: TITLEBAR_HEIGHT,
      },
      hideTimeout: 150,
    });
  }

  public rearrange() {
    const { width } = this.browserWindow.getContentBounds();
    super.rearrange({ width });
  }

  public async show(browserWindow: BrowserWindow) {
    super.show(browserWindow, false);

    const {
      id,
      url,
      title,
      errorURL,
    } = Application.instance.windows
      .fromBrowserWindow(browserWindow)
      .viewManager.views.get(this.tab.id);

    this.send('visible', true, {
      id,
      url: url.startsWith('wexond-error') ? errorURL : url,
      title,
      x: Math.round(this.tab.x - 8),
    });
  }

  public hide(bringToTop = true) {
    super.hide(bringToTop);
  }
}
