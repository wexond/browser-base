import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';

import { getPath } from '~/utils/paths';
import { IStorageResponse } from '~/interfaces';
import { HistoryService } from './history';
import { BookmarksService } from './bookmarks';
import { FaviconsService } from './favicons';

export class StorageService extends EventEmitter {
  public worker: Worker;

  public bookmarks: BookmarksService;

  public history: HistoryService;

  public favicons: FaviconsService;

  constructor() {
    super();

    console.log('Storage service is running.');

    this.worker = new Worker('./build/storage.bundle.js', {
      workerData: { storagePath: getPath('storage') },
    });

    this.worker.on('message', this.onMessage);

    this.bookmarks = new BookmarksService(this.worker);
    this.history = new HistoryService(this.worker);
  }

  private onMessage = (e: IStorageResponse) => {
    if (e.action === 'receiver') {
      (this[e.scope] as any)?.emit(e.eventName, ...e.data);
    }
  };
}
