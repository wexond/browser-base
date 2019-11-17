import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = 200;
const HEIGHT = 200;

export class TabGroupDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'tabgroup',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: TOOLBAR_HEIGHT,
      },
      devtools: true,
    });
  }

  public rearrange() {
    super.rearrange({ x: this.bounds.x });
  }

  public hide() {
    super.hide();
    this.webContents.send('visible', false);
  }

  public edit(tabGroup: any) {
    this.bounds.x = tabGroup.x;
    super.show();
    this.webContents.send('visible', true, tabGroup);
  }
}
