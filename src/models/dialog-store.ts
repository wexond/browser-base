import { ipcRenderer, remote } from 'electron';
import { observable, computed } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export class DialogStore {
  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @computed
  public get theme() {
    return getTheme(this.settings.theme);
  }

  @observable
  public visible = false;

  public constructor({ hideOnBlur } = { hideOnBlur: true }) {
    if (hideOnBlur) {
      window.addEventListener('blur', () => {
        if (this.visible) {
          setTimeout(() => {
            this.hide();
          });
        }
      });
    }

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }

  public get id() {
    return remote.getCurrentWebContents().id;
  }

  public get windowId() {
    return remote.getCurrentWindow().id;
  }

  public hide() {
    ipcRenderer.send(`hide-${this.id}`);
  }
}
