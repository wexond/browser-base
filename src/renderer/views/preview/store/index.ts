import { ipcRenderer } from 'electron';
import { observable, computed } from 'mobx';
import { parse } from 'url';
import { WEBUI_BASE_URL, WEBUI_PROTOCOL } from '~/constants/files';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public title = '';

  @observable
  public url = '';

  @observable
  public x = 0;

  @observable
  public xTransition = false;

  private timeout: any;
  private timeout1: any;

  @computed
  public get domain() {
    const parsed = parse(this.url);
    if (
      WEBUI_BASE_URL.startsWith(WEBUI_PROTOCOL) &&
      this.url.startsWith(WEBUI_BASE_URL)
    ) {
      return parsed.protocol + '//' + parsed.hostname;
    }

    if (parsed.protocol === 'file:') {
      return 'local or shared file';
    }

    return parsed.hostname;
  }

  public onVisibilityChange(visible: boolean, tab: any) {
    clearTimeout(this.timeout);
    clearTimeout(this.timeout1);

    if (!visible) {
      this.visible = false;
    }

    if (visible) {
      this.timeout1 = setTimeout(() => {
        this.xTransition = true;
      }, 80);
    } else if (!visible) {
      this.timeout = setTimeout(() => {
        this.xTransition = false;
      }, 100);
    }

    if (tab) {
      this.title = tab.title;
      this.url = tab.url;
      this.x = tab.x;

      if (visible && this.title !== '' && this.url !== '') {
        this.visible = visible;
      }
    }
  }
}

export default new Store();
