import { AppWindow } from '.';
import { TOOLBAR_HEIGHT } from '~/renderer/views/app/constants';
import { PopupWindow } from './popup';

const WIDTH = 208;
const HEIGHT = 128;
const MARGIN = 8;

export class FormFillWindow extends PopupWindow {
  public inputRect = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

  constructor(public appWindow: AppWindow) {
    super(appWindow, 'form-fill');

    this.setBounds({
      height: HEIGHT,
      width: WIDTH,
    } as any);
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();

    this.setBounds({
      x: cBounds.x + this.inputRect.x - 8,
      y: cBounds.y + this.inputRect.y + this.inputRect.height + TOOLBAR_HEIGHT - MARGIN + 2,
    } as any);
  }

  public resize(count: number, hasSubtext = false) {
    const itemHeight = hasSubtext ? 56 : 32;
    this.setSize(WIDTH, count * itemHeight + MARGIN * 2 + 16);
  }
}
