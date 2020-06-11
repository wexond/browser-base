import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { sendToExtensionPages } from '../background-pages';
import { EventHandler } from '../event-handler';
import { BrowserWindow } from 'electron';
import { Application } from '~/browser/application';

const getOverlayWindow = (sender: Electron.WebContents) => {
  const senderWindow = BrowserWindow.fromWebContents(sender);

  if (senderWindow.getParentWindow()) return senderWindow;

  if (sender.getType() === 'window')
    return Application.instance.windows.fromWebContents(sender)?.overlayWindow;

  return null;
};

export class OverlayPrivateAPI extends EventHandler {
  constructor() {
    super('overlayPrivate', ['onVisibilityStateChange']);
  }

  public start() {
    const handler = HandlerFactory.create('overlayPrivate', this);

    handler('setVisibility', this.setVisibility);
  }

  public setVisibility(
    {}: ISenderDetails,
    { name, visibility }: { name: string; visibility: boolean },
  ) {
    this.onVisibilityStateChange(name, visibility);
  }

  public onVisibilityStateChange(name: string, visible: boolean) {
    this.sendEventToAll('onVisibilityStateChange', name, visible);
  }
}
