import { BrowserWindow } from 'electron';
import { Application } from '../application';
import { DIALOG_MARGIN_TOP, DIALOG_MARGIN } from '~/constants/design';

export const showMenuDialog = (
  browserWindow: BrowserWindow,
  x: number,
  y: number,
) => {
  const menuWidth = 330;
  const dialog = Application.instance.dialogs.show({
    name: 'menu',
    browserWindow,
    getBounds: () => ({
      width: menuWidth,
      height: 510,
      x: x - menuWidth + DIALOG_MARGIN,
      y: y - DIALOG_MARGIN_TOP,
    }),
    onWindowBoundsUpdate: () => {
      dialog.hide();
    },
  });
};
