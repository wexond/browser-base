import { Application } from '../application';
import { extensions } from '../extensions';
import { ipcMain, screen, BrowserWindow } from 'electron';

const contains = (regions: number[][], x: number, y: number) => {
  for (const region of regions) {
    if (
      x >= region[0] &&
      y >= region[1] &&
      x <= region[0] + region[2] &&
      y <= region[1] + region[3]
    ) {
      return true;
    }
  }

  return false;
};

export class OverlayService {
  constructor() {
    ipcMain.on('mouse-move', (e) => {
      const { x, y } = screen.getCursorScreenPoint();

      const overlay = this.fromWebContents(e.sender);
      const pos = overlay.contentBounds;

      overlay.setIgnoreMouseEvents(
        !contains(overlay.regions, x - pos.x, y - pos.y),
      );
    });

    extensions.overlayPrivate.start(this);
  }

  public fromWebContents(sender: Electron.WebContents) {
    const senderWindow = BrowserWindow.fromWebContents(sender);
    const parentWindow = senderWindow?.getParentWindow();

    if (senderWindow && parentWindow)
      return Application.instance.windows.fromBrowserWindow(parentWindow)
        .overlayWindow;

    if (sender.getType() === 'window' || sender.getType() === 'browserView')
      return Application.instance.windows.fromWebContents(sender)
        ?.overlayWindow;

    return null;
  }
}
