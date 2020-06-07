import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';
import { Application } from './application';
import { makeId } from '~/common/utils/string';

export class StorageFactory {
  private static get worker() {
    return Application.instance.storageWorker;
  }

  public static createInvoker = (scope: IStorageScope) => <T>(
    method: string,
    ...args: any[]
  ) => {
    return new Promise<T>((resolve, reject) => {
      const id = makeId(24);

      const onResponse = (res: IStorageResponse) => {
        if (res.action === 'invoker' && res.id === id) {
          if (res.error || !res.success) {
            return reject(res.error);
          }

          resolve(res.data);
        }
      };

      StorageFactory.worker.on('message', onResponse);

      StorageFactory.worker.postMessage({
        id,
        method,
        scope,
        args,
      } as IStorageMessage);
    });
  };

  public static createReceiver = (scope: IStorageScope) => {
    const registry = new Map<string, Function>();
    let listenerAdded = false;

    const onMessage = (res: IStorageResponse) => {
      if (res.action === 'receiver' && res.scope === scope) {
        const listener = registry.get(res.data.eventName);

        listener(res.data);
      }
    };

    return (eventName: string, listener: Function) => {
      registry.set(eventName, listener);

      if (!listenerAdded) {
        listenerAdded = true;
        console.log('XDDDDDDDDDDDDDDDDD', Application);
        // StorageFactory.worker.on('message', onMessage);
      }
    };
  };
}
