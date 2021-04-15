import { RpcMainEvent, RpcMainHandler } from '@wexond/rpc-electron';
import { session, webContents } from 'electron';
import {
  extensionMainChannel,
  ExtensionMainService,
} from '~/common/rpc/extensions';
import { Application } from './application';

export class ExtensionServiceHandler
  implements RpcMainHandler<ExtensionMainService> {
  constructor() {
    extensionMainChannel.getReceiver().handler = this;
  }

  inspectBackgroundPage(e: RpcMainEvent, id: string): void {
    webContents
      .getAllWebContents()
      .find(
        (x) =>
          x.session === Application.instance.sessions.view &&
          new URL(x.getURL()).hostname === id,
      )
      .openDevTools({ mode: 'detach' });
  }

  uninstall(e: RpcMainEvent, id: string): void {
    Application.instance.sessions.uninstallExtension(id);
  }
}
