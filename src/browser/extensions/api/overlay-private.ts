import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { sendToExtensionPages } from '../background-pages';
import { EventHandler } from '../event-handler';
import { BrowserWindow } from 'electron';
import { Application } from '~/browser/application';

export const getOverlayWindow = (sender: Electron.WebContents) => {
  const senderWindow = BrowserWindow.fromWebContents(sender);
  const parentWindow = senderWindow?.getParentWindow();

  if (senderWindow && parentWindow)
    return Application.instance.windows.fromBrowserWindow(parentWindow)
      .overlayWindow;

  if (sender.getType() === 'window' || sender.getType() === 'browserView')
    return Application.instance.windows.fromWebContents(sender)?.overlayWindow;

  return null;
};

export class OverlayPrivateAPI extends EventHandler {
  public regions: number[][] = [];

  private ignore = true;

  constructor() {
    super('overlayPrivate', ['onPopupUpdated', 'onRegionsUpdated']);

    const handler = HandlerFactory.create('overlayPrivate', this);

    handler('updatePopup', this.updatePopup);
    handler('setRegions', this.setRegions);
    handler('getRegions', this.getRegions);
    handler('setIgnoreMouseEvents', this.setIgnoreMouseEvents);
  }

  public start() {}

  public setIgnoreMouseEvents(
    { sender }: ISenderDetails,
    { flag }: { flag: boolean },
  ) {
    const overlay = getOverlayWindow(sender);
    if (!overlay) return;

    if (this.ignore !== flag) {
      overlay.setIgnoreMouseEvents(flag);
      this.ignore = flag;
    }
  }

  public updatePopup(
    {}: ISenderDetails,
    { name, info }: { name: string; info: browser.overlayPrivate.PopupInfo },
  ) {
    this.sendEventToAll('onPopupUpdated', name, info);
  }

  public getRegions() {
    return this.regions;
  }

  public setRegions({}: ISenderDetails, { regions }: { regions: number[][] }) {
    this.regions = regions;
    this.sendEventToAll('onRegionsUpdated', regions);
  }
}
