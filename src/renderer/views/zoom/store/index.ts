import { ipcRenderer } from 'electron';
import { reaction, observable, makeObservable } from 'mobx';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public zoomFactor = 1;

  public timer: any = 0;

  public constructor() {
    super();
    makeObservable(this, { zoomFactor: observable });
    this.init();
  }

  public async init() {
    const zoomFactorChange = reaction(
      () => this.zoomFactor,
      () => this.resetHideTimer(),
    );

    ipcRenderer.on('zoom-factor-updated', (e, zoomFactor) => {
      this.zoomFactor = zoomFactor;
    });

    const tabId = await this.invoke('tab-id');
    this.zoomFactor = await ipcRenderer.invoke('get-tab-zoom', tabId);

    this.resetHideTimer();
  }

  public resetHideTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.hide();
    }, 1500);
  }

  public stopHideTimer() {
    clearTimeout(this.timer);
  }
}

export default new Store();
