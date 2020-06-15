import { parentPort } from 'worker_threads';
import { EventEmitter } from 'events';

import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';

export class HandlerFactory {
  public static createInvoker(scope: IStorageScope, bind: any) {
    const registry = new Map<string, Function>();

    const listener = async (message: IStorageMessage) => {
      if (message.scope === scope) {
        const { id } = message;
        let { args } = message;

        if (!(args instanceof Array)) {
          args = [args];
        }

        const fn = registry.get(message.method);

        if (fn) {
          let data: any;
          let error: Error;

          try {
            data = await fn(...args);
          } catch (err) {
            error = err;
            console.error(`Storage error (id: ${id}):`, error);
          }

          parentPort.postMessage({
            action: 'invoker',
            id,
            data,
            success: !error,
            error,
          } as IStorageResponse);
        }
      }
    };

    parentPort.on('message', listener);

    return (name: string, fn: (...args: any[]) => void) => {
      registry.set(name, fn.bind(bind));
    };
  }

  public static createReceiver(
    scope: IStorageScope,
    bind: EventEmitter,
    events: string[],
  ) {
    events.forEach((r) => {
      bind.addListener(r, (...data: any[]) => {
        parentPort.postMessage({
          action: 'receiver',
          scope,
          eventName: r,
          data,
        } as IStorageResponse);
      });
    });
  }
}
