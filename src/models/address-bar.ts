import { observable } from 'mobx';

export class AddressBar {
  @observable
  public toggled = false;

  @observable
  public canToggle = false;
}
