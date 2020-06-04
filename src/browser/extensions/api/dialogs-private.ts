import { HandlerFactory } from '../handler-factory';
import { sendToExtensionPages } from '../background-pages';

export class DialogsPrivateAPI {
  constructor() {
    const handler = HandlerFactory.create('dialogsPrivate', this);
  }

  public onVisibilityStateChange(name: string, visible: boolean) {
    sendToExtensionPages(
      'dialogsPrivate.onVisibilityStateChange',
      name,
      visible,
    );
  }
}
