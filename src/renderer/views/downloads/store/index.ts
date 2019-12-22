import { ipcRenderer, remote } from 'electron';
import { observable, computed } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings, IDownloadItem } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export class Store {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public visible = false;

  @observable
  public id = remote.getCurrentWebContents().id;

  @observable
  public windowId = remote.getCurrentWindow().id;

  @observable
  public downloads: IDownloadItem[] = [];

  @observable
  public maxHeight = 0;

  public constructor() {
    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    window.addEventListener('blur', () => {
      if (this.visible) {
        setTimeout(() => {
          this.hide();
        });
      }
    });

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });

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

  public hide() {
    ipcRenderer.send(`hide-${this.id}`);
  }
}

export default new Store();
