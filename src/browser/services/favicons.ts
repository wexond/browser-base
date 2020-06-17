import { Worker } from 'worker_threads';

import { IFavicon } from '~/interfaces';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';

export class FaviconsService {
  private invoker = WorkerMessengerFactory.createInvoker('bookmarks');

  constructor(worker: Worker) {
    this.invoker.initialize(worker);
  }

  public getFaviconUrl = (pageUrl: string) =>
    this.invoker.invoke<string>('getFaviconUrl', pageUrl);

  public getFavicon = (url: string) =>
    this.invoker.invoke<IFavicon>('getFavicon', url);
}
