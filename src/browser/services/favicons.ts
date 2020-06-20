import { Worker } from 'worker_threads';
import { ipcMain } from 'electron';

import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { bufferFromUint8Array } from '~/common/utils/buffer';
import { IFaviconOptions } from '~/interfaces';

export class FaviconsService {
  private invoker = WorkerMessengerFactory.createInvoker('favicons');

  constructor(worker: Worker) {
    this.invoker.initialize(worker);

    ipcMain.handle('favicon-exists', (e, pageUrl: string) => {
      return this.faviconExists(pageUrl);
    });
  }

  public getFavicon = async (options: IFaviconOptions) => {
    return bufferFromUint8Array(
      await this.invoker.invoke<Uint8Array>('getFavicon', options),
    );
  };

  public saveFavicon = async (pageUrl: string, faviconUrl: string) => {
    return bufferFromUint8Array(
      await this.invoker.invoke<Uint8Array>('saveFavicon', pageUrl, faviconUrl),
    );
  };

  public faviconExists = (pageUrl: string) =>
    this.invoker.invoke<boolean>('faviconExists', pageUrl);
}
