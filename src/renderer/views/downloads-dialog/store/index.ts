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

    ipcRenderer.on('download-started', (e, item) => {
      this.downloads.push(item);
    });

    ipcRenderer.on('download-progress', (e, item: IDownloadItem) => {
      const index = this.downloads.indexOf(
        this.downloads.find(x => x.id === item.id),
      );

      this.downloads[index] = {
        ...this.downloads[index],
        ...item,
      };
    });

    ipcRenderer.on('download-completed', (e, id: string) => {
      const i = this.downloads.find(x => x.id === id);
      i.completed = true;
    });

    ipcRenderer.on('max-height', (e, height) => {
      this.maxHeight = height;
    });
  }

  public onVisibilityChange(visible: boolean) {
    this.visible = visible;
  }
}

export default new Store();
