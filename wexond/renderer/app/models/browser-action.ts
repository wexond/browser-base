import { observable } from 'mobx';

interface Options {
  icon: string;
  title: string;
  popup: string;
  extensionId: string;
}

export class BrowserAction {
  @observable
  public icon?: string;

  @observable
  public popup?: string;

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

  constructor(options: Options) {
    const { icon, title, extensionId, popup } = options;
    this.icon = icon;
    this.title = title;
    this.popup = popup;
    this.extensionId = extensionId;
  }
}
