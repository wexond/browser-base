import { AppWindow } from './windows/app';

export class WindowsService {
  public list: AppWindow[] = [];

  public current: AppWindow;

  public open(incognito = false) {
    const window = new AppWindow(incognito);
    this.list.push(window);
  }

  public findByBrowserView(webContentsId: number) {
    return this.list.find((x) => !!x.viewManager.views.get(webContentsId));
  }

  public broadcast(channel: string, ...args: unknown[]) {
    this.list.forEach((appWindow) =>
      appWindow.win.webContents.send(channel, ...args),
    );
  }
}
