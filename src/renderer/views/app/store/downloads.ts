import { makeObservable, observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { IDownloadItem } from '~/interfaces';

export class DownloadsStore {
  public list: IDownloadItem[] = [];

  public constructor() {
    makeObservable(this, { list: observable });

    ipcRenderer.on('download-started', (e, item: IDownloadItem) => {
      this.list.push(item);

      const not = new Notification(`Downloading ${item.fileName}`, {
        body: 'Open Overlay to see the downloads.',
      });

      not.onclick = () => {
        // TODO(sentialx): downloads notification
        // store.overlay.visible = true;
      };
    });

    ipcRenderer.on('download-progress', (e, item: IDownloadItem) => {
      const i = this.list.find((x) => x.id === item.id);
      i.receivedBytes = item.receivedBytes;
    });

    ipcRenderer.on('download-completed', (e, id: string) => {
      const i = this.list.find((x) => x.id === id);
      i.completed = true;
    });
  }
}
