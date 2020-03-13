import { observable, computed } from 'mobx';
import { EXTENSIONS_PROTOCOL } from '~/constants';
import { format } from 'url';

interface Options {
  icon: string;
  title: string;
  popup: string;
  extensionId: string;
}

export class IBrowserAction {
  @observable
  public icon?: string;

  @observable
  private _popup?: string;

  public set popup(url: string) {
    if (!url) {
      this._popup = null;
    } else if (url.startsWith(EXTENSIONS_PROTOCOL)) {
      this._popup = url;
    } else {
      this._popup = format({
        protocol: EXTENSIONS_PROTOCOL,
        slashes: true,
        hostname: this.extensionId,
        pathname: url,
      });
    }
  }

  @computed
  public get popup() {
    return this._popup;
  }

  @observable
  public title?: string;

  @observable
  public badgeBackgroundColor?: string = 'gray';

  @observable
  public badgeTextColor?: string = 'white';

  @observable
  public badgeText?: string = '';

  public tabId?: number;

  public extensionId?: string;

  public wasOpened = false;

  public constructor(options: Options) {
    const { icon, title, extensionId, popup } = options;
    this.icon = icon;
    this.title = title;
    this.extensionId = extensionId;
    this.popup = popup;
  }
}
