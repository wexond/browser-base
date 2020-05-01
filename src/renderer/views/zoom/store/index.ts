import { ipcRenderer } from 'electron';
import { reaction, observable } from 'mobx';
import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  @observable
  public zoomFactor = 1;

  public timer = 0;

  public constructor() {
    super();

    ipcRenderer.on('zoom-factor-updated', (e, zoomFactor) => {
      this.zoomFactor = zoomFactor;
    });

    const zoomFactorChange = reaction(
      () => this.zoomFactor,
      () => this.resetHideTimer()
    )
  }

  public async onVisibilityChange(visible: boolean) {
    this.visible = visible;
    if (visible) {
      this.resetHideTimer();
    }
  }

  public resetHideTimer() {
    clearTimeout(this.timer);
    var context = this;
    this.timer = setTimeout(function () {
      context.hide();
    }, 1500);
  }

  public stopHideTimer() {
    clearTimeout(this.timer);
  }
}

export default new Store();
