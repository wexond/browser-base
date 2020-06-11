import { HandlerFactory } from '../handler-factory';
import { sendToExtensionPages } from '../background-pages';

export class OverlayPrivateAPI {
  constructor() {
    const handler = HandlerFactory.create('overlayPrivate', this);
  }

  public onVisibilityStateChange(name: string, visible: boolean) {
    sendToExtensionPages(
      'overlayPrivate.onVisibilityStateChange',
      name,
      visible,
    );
  }
}
