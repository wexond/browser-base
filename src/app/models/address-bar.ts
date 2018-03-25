import { observable } from 'mobx';

export default class AddressBar {
  @observable public toggled = false;
  @observable public canToggle = false;
}
