import { format } from 'url';
import { ipcRenderer } from 'electron';

import { makeId } from '@/utils/strings';
import { API_RUNTIME_CONNECT } from '@/constants/extensions';
import { Port, CustomEvent } from '@/models/extensions';
import { Manifest } from '@/interfaces/extensions';

let manifest: Manifest;

// https://developer.chrome.com/extensions/runtime

export class Runtime {
  /**
   * The ID of the extension/app.
   *
   * @type {string}
   */
  public id: string;

  /**
   * This will be defined during an API method callback if there was an error
   *
   * @type {object}
   * @property {string} message (optional)
   */
  public lastError: chrome.runtime.LastError;

  /**
   * Fired when a connection is made from either an extension process
   * or a content script (by runtime.connect).
   *
   * @event
   * @type {Port} port
   */
  public onConnect = new CustomEvent();

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    manifest = _manifest;

    this.id = manifest.extensionId;
  }

  /**
   * Attempts to connect to connect listeners within an extension/app
   * (such as the background page), or other extensions/apps.
   * This is useful for content scripts connecting to their extension processes,
   * inter-app/extension communication, and web messaging.
   * Note that this does not connect to any listeners in a content script.
   * Extensions may connect to content scripts embedded in tabs via tabs.connect.
   *
   * @param {string | ConnectInfo} arg1
   * (optional) The ID of the extension or app to connect to.
   * If omitted, a connection will be attempted with your own extension.
   * Required if sending messages from a web page for web messaging.
   *
   * @param {ConnectInfo} arg2 (optional) connectInfo
   * @returns {Port} port
   */
  public connect(arg1: string | any = null, arg2: any = null) {
    const sender: any = {
      id: this.id,
      url: window.location.href,
      frameId: 0,
    };

    const portId = makeId(32);

    let name: string = null;
    let extensionId: string = this.id;

    if (typeof arg1 === 'string') {
      extensionId = arg1;

      if (arg2 && typeof arg2 === 'object') {
        if (arg2.includeTlsChannelId) {
          sender.tlsChannelId = portId;
        }
        name = arg2.name;
      }
    } else if (arg1 && typeof arg1 === 'object') {
      if (arg1.includeTlsChannelId) {
        sender.tlsChannelId = portId;
      }
      name = arg1.name;
    }

    ipcRenderer.send(API_RUNTIME_CONNECT, {
      extensionId,
      portId,
      sender,
      name,
    });

    return new Port(portId, name);
  }

  /**
   * Reloads the app or extension.
   * This method is not supported in kiosk mode.
   * For kiosk mode, use chrome.runtime.restart() method.
   */
  public reload() {
    ipcRenderer.send('api-runtime-reload', this.id);
  }

  /**
   * Converts a relative path within an app/extension install directory to a fully-qualified URL.
   *
   * @param {string} path
   * A path to a resource within an app/extension expressed relative to its install directory.
   *
   * @returns {string}
   */
  public getURL(path: string) {
    return format({
      protocol: 'wexond-extension',
      slashes: true,
      hostname: this.id,
      pathname: path,
    });
  }

  /**
   * Returns details about the app or extension from the manifest.
   * The object returned is a serialization of the full manifest file.
   *
   * @returns {Manifest}
   */
  public getManifest = () => manifest;
}
