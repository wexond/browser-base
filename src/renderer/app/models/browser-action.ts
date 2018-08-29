import { observable } from 'mobx';

export class BrowserAction {
  @observable
  public icon: string;

  @observable
  public popup: string;

  @observable
  public title: string;

  @observable
  public badgeBackgroundColor: string = 'gray';

  @observable
  public badgeTextColor: string = 'white';

  @observable
  public badgeText: string = '';

  public extensionId: string;

  constructor(
    extensionId: string,
    icon: string,
    title: string,
    popup: string = null,
  ) {
    this.icon = icon;
    this.title = title;
    this.popup = popup;
    this.extensionId = extensionId;
  }
}
