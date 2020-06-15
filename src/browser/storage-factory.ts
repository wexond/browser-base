import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';
import { makeId } from '~/common/utils/string';
import { Application } from './application';

export class StorageInvokerFactory {
  public static create = (scope: IStorageScope) => <T>(
    method: string,
    ...args: any[]
  ) => {
    return new Promise<T>((resolve, reject) => {
      const { worker } = Application.instance.storage;
      const id = makeId(24);

      const onResponse = (res: IStorageResponse) => {
        if (res.action === 'invoker' && res.id === id) {
          StorageFactory.worker.removeListener('message', onResponse);

          if (res.error || !res.success) {
            return reject(res.error);
          }

          resolve(res.data);
        }
      };

      worker.on('message', onResponse);

      worker.postMessage({
        id,
        method,
        scope,
        args,
      } as IStorageMessage);
    });
  };
}
