import { Application } from '../application';
import { extensions } from '../extensions';
import { ipcMain, BrowserWindow } from 'electron';
import { OverlayWindow } from '../windows/overlay';

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
    setInterval(() => {
      // TODO(sentialx): make sure it works on other windows
      const overlay = Application.instance.windows.list[0].overlayWindow;
      const [x, y] = overlay.getCursorPoint();

      overlay.setIgnoreMouseEvents(!contains(overlay.regions, x, y));
    }, 1);

    extensions.overlayPrivate.start(this);
  }

  public fromWebContents(sender: Electron.WebContents): OverlayWindow {
    if (!sender) return null;

    const senderWindow = BrowserWindow.fromWebContents(sender);
    const parentWindow = senderWindow?.getParentWindow();

    if (senderWindow && parentWindow)
      return Application.instance.windows.fromBrowserWindow(parentWindow)
        .overlayWindow;

    if (sender.getType() === 'webview') {
      return this.fromWebContents(
        (sender as any).getOwnerBrowserWindow()?.webContents,
      );
    }

    return Application.instance.windows.fromWebContents(sender)?.overlayWindow;
  }
}
