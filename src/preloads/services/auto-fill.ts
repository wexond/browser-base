import { ipcRenderer } from 'electron';

import { windowId, tabId } from '../view-preload';

class AutoFillService {
  private active = false;

  private usernameRef: HTMLInputElement;

  private passwordRef: HTMLInputElement;

  public init() {
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyUp = (e: KeyboardEvent) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      if (target.name === 'password') {
        this.passwordRef = target;

        const active = target.value.length > 0;

        if (active !== this.active) {
          this.active = active;
          this.setAvailability(active);
        }

        this.sendData();
      } else if (target.name === 'username') {
        this.usernameRef = target;
        this.sendData();
      }
    }
  };

  private sendData() {
    const username = this.usernameRef?.value;
    const password = this.passwordRef?.value;

    ipcRenderer.send(`credentials-data-${windowId}`, username, password);
  }

  private setAvailability(active: boolean) {
    ipcRenderer.send(`credentials-available-${windowId}`, active, tabId);
  }
}

export default new AutoFillService();
