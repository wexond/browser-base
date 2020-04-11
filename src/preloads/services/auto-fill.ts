import { ipcRenderer } from 'electron';

import { windowId, tabId } from '../view-preload';
import { IAutoFillCredentialsData, IAutoFillMenuPosition } from '~/interfaces';
import { setInputValue } from '../utils';
import { AUTOFILL_FIELDS } from '../constants/auto-fill';

class AutoFillService {
  private active = false;

  private usernameRef: HTMLInputElement;

  private passwordRef: HTMLInputElement;

  private injected: IAutoFillCredentialsData;

  constructor() {
    ipcRenderer.on(
      'credentials-inject',
      (e, data: IAutoFillCredentialsData) => {
        this.injected = data;

        requestAnimationFrame(() => {
          setInputValue(data?.username, 'username', 'email');
          setInputValue(data?.password, 'password');
        });
      },
    );
  }

  public init() {
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('focusin', this.onFocus);
    window.addEventListener('focusout', this.onBlur);
  }

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) {
      if (e.target.name === 'password') {
        this.passwordRef = e.target;

        const active = e.target.value.length > 0;

        if (active !== this.active) {
          this.active = active;
          this.setAvailability(active);
        }

        this.sendData();
      } else if (e.target.name === 'username') {
        this.usernameRef = e.target;
        this.sendData();
      }
    }
  };

  private onFocus = (e: MouseEvent) => {
    if (
      e.target instanceof HTMLInputElement &&
      AUTOFILL_FIELDS.includes(e.target.name)
    ) {
      ipcRenderer.send(
        `auto-fill-show-${windowId}`,
        this.getMenuPos(e.target),
        e.target.name,
        e.target.value,
      );
    }
  };

  private onBlur = (e: MouseEvent) => {
    if (
      e.target instanceof HTMLInputElement &&
      AUTOFILL_FIELDS.includes(e.target.name)
    ) {
      ipcRenderer.send(`auto-fill-hide-${windowId}`);
    }
  };

  private sendData() {
    const username = this.usernameRef?.value ?? this.injected?.username;
    const password = this.passwordRef?.value ?? this.injected?.password;

    ipcRenderer.send(`credentials-data-${windowId}`, username, password);
  }

  private setAvailability(active: boolean) {
    ipcRenderer.send(`credentials-available-${windowId}`, active, tabId);
  }

  private getMenuPos(ref: HTMLInputElement): IAutoFillMenuPosition {
    const { height, left, top } = ref.getBoundingClientRect();

    return {
      height,
      x: Math.floor(left),
      y: Math.floor(top),
    };
  }
}

export default new AutoFillService();
