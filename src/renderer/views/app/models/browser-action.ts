import { observable, computed, makeObservable } from 'mobx';
import { EXTENSIONS_PROTOCOL } from '~/constants';
import { format } from 'url';

interface Options {
  icon: string;
  title: string;
  popup: string;
  extensionId: string;
}

export class IBrowserAction {
  // Observable
  public icon?: string = '';

  public _popup?: string = '';

  public title?: string = '';

  public badgeBackgroundColor?: string = 'gray';

  public badgeTextColor?: string = 'white';

  public badgeText?: string = '';

  // Computed
  public get popup() {
    return this._popup;
  }
  // ---

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

  public tabId?: number;

  public extensionId?: string;

  public wasOpened = false;

  public constructor(options: Options) {
    makeObservable(this, {
      icon: observable,
      _popup: observable,
      title: observable,
      badgeBackgroundColor: observable,
      badgeText: observable,
      badgeTextColor: observable,
      popup: computed,
    });

    const { icon, title, extensionId, popup } = options;
    this.icon = icon;
    this.title = title;
    this.extensionId = extensionId;
    this.popup = popup;
  }
}
