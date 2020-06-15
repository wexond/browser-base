import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';
import { makeId } from '~/common/utils/string';
import { StorageService } from './services/storage';
import { Application } from './application';

export class StorageFactory {
  private static get worker() {
    return Application.instance.storage.worker;
  }

  public static create = (scope: IStorageScope) => <T>(
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
}
