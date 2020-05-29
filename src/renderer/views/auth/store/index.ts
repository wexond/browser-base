import { observable } from 'mobx';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public url: string;

  public constructor() {
    super({ hideOnBlur: false, visibilityWrapper: false });

    this.onUpdateTabInfo = (tabId, auth) => {
      this.url = auth.url;
    };
  }
}

export default new Store();
