import { RpcMainEvent, RpcMainHandler } from '@wexond/rpc-electron';
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

  uninstall(e: RpcMainEvent, id: string): void {
    Application.instance.sessions.uninstallExtension(id);
  }
}
