import { parentPort } from 'worker_threads';
import { EventEmitter } from 'events';

import { IStorageScope, IStorageResponse } from '~/interfaces';

export const registerWorkerEventPropagator = (
  scope: IStorageScope,
  events: string[],
  emitter: EventEmitter,
) => {
  events.forEach((r) => {
    emitter.addListener(r, (...data: any[]) => {
      parentPort.postMessage({
        action: 'receiver',
        scope,
        eventName: r,
        data,
      } as IStorageResponse);
    });
  });
};
