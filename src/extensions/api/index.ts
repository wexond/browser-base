import { Alarms } from './alarms';
import { Runtime } from './runtime';
import { IpcExtension } from '~/shared/models';
import { WebNavigation } from './web-navigation';
import { Extension } from './extension';
import { Tabs } from './tabs';
import { WebRequest } from './web-request';
import { I18n } from './i18n';
import { BrowserAction } from './browser-action';
import { Storage } from './storage';

// https://developer.chrome.com/extensions/api_index

export class API {
  public _extension: IpcExtension;

  public runtime: Runtime;
  public webNavigation: WebNavigation;
  public alarms: Alarms;
  public storage: Storage;
  public extension: Extension;
  public tabs: Tabs;
  public webRequest: WebRequest;
  public i18n: I18n;
  public browserAction: BrowserAction;

  // tslint:disable-next-line
  constructor(extension: IpcExtension) {
    this._extension = extension;

    this.runtime = new Runtime(this);
    this.webNavigation = new WebNavigation();
    this.alarms = new Alarms(this);
    this.storage = new Storage(this);
    this.extension = new Extension();
    this.tabs = new Tabs(this);
    this.webRequest = new WebRequest();
    this.i18n = new I18n(this);
    this.browserAction = new BrowserAction(this);
  }
}
