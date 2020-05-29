import { ipcRenderer } from 'electron';
import { observable } from 'mobx';
import { IDownloadItem } from '~/interfaces';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public downloads: IDownloadItem[] = [];

  @observable
  public maxHeight = 0;

  public constructor() {
    super();

    this.init();

    ipcRenderer.on('download-started', (e, item) => {
      this.downloads.push(item);
    });

    ipcRenderer.on('download-progress', (e, item: IDownloadItem) => {
      const index = this.downloads.indexOf(
        this.downloads.find((x) => x.id === item.id),
      );

      this.downloads[index] = {
        ...this.downloads[index],
        ...item,
      };
    });

    ipcRenderer.on('download-completed', (e, id: string) => {
      const i = this.downloads.find((x) => x.id === id);
      i.completed = true;
    });

    ipcRenderer.on('max-height', (e, height) => {
      this.maxHeight = height;
    });
  }

  public async init() {
    this.downloads = await ipcRenderer.invoke('get-downloads');
  }
}

export default new Store();
