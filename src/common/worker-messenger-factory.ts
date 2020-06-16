import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';
import { makeId } from '~/common/utils/string';
import { MessagePort, parentPort, Worker } from 'worker_threads';

export class WorkerMessengerFactory {
  public static createInvoker = (
    scope: IStorageScope,
    port: MessagePort | Worker,
  ) => <T>(method: string, ...args: any[]) => {
    return new Promise<T>((resolve, reject) => {
      const id = makeId(24);

      const onResponse = (res: IStorageResponse) => {
        if (res.action === 'invoker' && res.id === id) {
          port.removeListener('message', onResponse);

          if (res.error || !res.success) {
            return reject(res.error);
          }

          resolve(res.data);
        }
      };

      port.on('message', onResponse);

      port.postMessage({
        id,
        method,
        scope,
        args,
      } as IStorageMessage);
    });
  };

  public static createHandler(scope: IStorageScope, bind: any) {
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
}
