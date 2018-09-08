import { ipcRenderer } from 'electron';

import { CustomEvent } from '@/models/extensions/custom-event';
import { API_PORT_POSTMESSAGE } from '@/constants/extensions';

export class Port {
  public sender: chrome.runtime.MessageSender;
  public name: string;
  public onMessage = new CustomEvent();
  public onDisconnect = new CustomEvent();

  private portId: string;

  constructor(
    portId: string,
    name: string = null,
    sender: chrome.runtime.MessageSender = null,
  ) {
    if (sender) {
      this.sender = sender;
    }

    if (name) {
      this.name = name;
    }

    this.portId = portId;

    ipcRenderer.on(API_PORT_POSTMESSAGE + portId, (e: any, msg: any) => {
      this.onMessage.emit(msg, this);
    });
  }

  public disconnect() {
    ipcRenderer.removeAllListeners(API_PORT_POSTMESSAGE + this.portId);
  }

  public postMessage(msg: any) {
    setTimeout(() => {
      ipcRenderer.send(API_PORT_POSTMESSAGE, { portId: this.portId, msg });
    });
  }
}
