import { makeObservable, observable } from 'mobx';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public url = '';

  public constructor() {
    super({ hideOnBlur: false, visibilityWrapper: false });

    makeObservable(this, { url: observable });

    this.onUpdateTabInfo = (tabId, auth) => {
      this.url = auth.url;
    };
  }
}

export default new Store();
