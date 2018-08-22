import { observable } from 'mobx';

export class AddressBarStore {
  @observable
  public toggled = false;

  @observable
  public canToggle = false;
}
