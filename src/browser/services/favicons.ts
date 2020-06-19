import { Worker } from 'worker_threads';

import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';

export class FaviconsService {
  private invoker = WorkerMessengerFactory.createInvoker('favicons');

  constructor(worker: Worker) {
    this.invoker.initialize(worker);
  }

  public getFavicon = (pageUrl: string) =>
    this.invoker.invoke<Buffer>('getFavicon', pageUrl);

  public saveFavicon = (pageUrl: string, faviconUrl: string) =>
    this.invoker.invoke<Buffer>('saveFavicon', pageUrl, faviconUrl);
}
