import { ipcRenderer } from 'electron';
import { action, makeObservable, observable } from 'mobx';
import { IDownloadItem } from '~/interfaces';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public downloads: IDownloadItem[] = [];

  public maxHeight = 0;

  public constructor() {
    super();

    makeObservable(this, { downloads: observable, maxHeight: observable });

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

    ipcRenderer.on('download-paused', (e, id: string) => {
      const i = this.downloads.find((x) => x.id === id);
      i.paused = true;
    });

    ipcRenderer.on('download-canceled', (e, id: string) => {
      const i = this.downloads.find((x) => x.id === id);
      i.completed = false;
      i.canceled = true;
    });

    ipcRenderer.on('max-height', (e, height) => {
      this.maxHeight = height;
    });
  }

  public async init() {
    this.downloads = await ipcRenderer.invoke('get-downloads');
  }

  @action
  public openMenu(item: IDownloadItem) {
    const state = item.menuIsOpen;
    this.closeAllDownloadMenu();
    const index = this.downloads.indexOf(
      this.downloads.find((x) => x.id === item.id),
    );

    this.downloads[index] = {
      ...this.downloads[index],
      menuIsOpen: !state,
    };
  }

  @action
  public closeAllDownloadMenu() {
    const downloads = this.downloads.map((download) => ({
      ...download,
      menuIsOpen: false,
    }));
    this.downloads = downloads;
  }
}

export default new Store();
