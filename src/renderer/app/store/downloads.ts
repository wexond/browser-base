import { observable } from 'mobx';
import { DownloadItem } from '../models/download-item';
import { ipcRenderer } from 'electron';

export class DownloadsStore {
  @observable
  public list: DownloadItem[] = [];

  constructor() {
    ipcRenderer.on('download-started', (e: any, item: DownloadItem) => {
      this.list.push(item);
    });

    ipcRenderer.on('download-progress', (e: any, item: DownloadItem) => {
      const i = this.list.find(x => x.id === item.id);
      i.receivedBytes = item.receivedBytes;
    });

    ipcRenderer.on('download-completed', (e: any, id: string) => {
      const i = this.list.find(x => x.id === id);
      i.completed = true;
    });
  }
}
