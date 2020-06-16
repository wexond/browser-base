import { IStorageScope, IStorageMessage, IStorageResponse } from '~/interfaces';
import { makeId } from '~/common/utils/string';
import { MessagePort, parentPort, Worker } from 'worker_threads';

export class WorkerMessengerFactory {
  public static createInvoker = (scope: IStorageScope) => {
    let p: MessagePort | Worker;

    return {
      initialize: (port: MessagePort | Worker) => {
        p = port;
      },
      invoke: <T>(method: string, ...args: any[]) => {
        if (!p) throw new Error("Invoker hasn't been initialized.");

        return new Promise<T>((resolve, reject) => {
          const id = makeId(24);

          const onResponse = (res: IStorageResponse) => {
            if (res.action === 'invoker' && res.id === id) {
              p.removeListener('message', onResponse);

              if (res.error || !res.success) {
                return reject(res.error);
              }

              resolve(res.data);
            }
          };

          p.on('message', onResponse);

          p.postMessage({
            id,
            method,
            scope,
            args,
          } as IStorageMessage);
        });
      },
    };
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
