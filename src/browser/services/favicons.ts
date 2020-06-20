import { Worker } from 'worker_threads';
import { ipcMain } from 'electron';

import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { bufferFromUint8Array } from '~/common/utils/buffer';

export class FaviconsService {
  private invoker = WorkerMessengerFactory.createInvoker('favicons');

  constructor(worker: Worker) {
    this.invoker.initialize(worker);

    ipcMain.handle('favicon-exists', (e, pageUrl: string) => {
      return this.faviconExists(pageUrl);
    });
  }

  public getPageURLForHost = (host: string) =>
    this.invoker.invoke<string>('getPageURLForHost', host);

  public getFavicon = async (iconUrl: string) => {
    return bufferFromUint8Array(
      await this.invoker.invoke<Uint8Array>('getFavicon', iconUrl),
    );
  };

  public getFaviconForPageURL = async (pageUrl: string) => {
    return bufferFromUint8Array(
      await this.invoker.invoke<Uint8Array>('getFaviconForPageURL', pageUrl),
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
