import { Manifest } from '@/interfaces/extensions';
import {
  Runtime,
  WebNavigation,
  Alarms,
  Storage,
  Extension,
  Tabs,
  BrowserAction,
  WebRequest,
  I18n,
} from '.';

// https://developer.chrome.com/extensions/api_index

export class API {
  public runtime: Runtime;
  public webNavigation = new WebNavigation();
  public alarms = new Alarms(this);
  public storage = new Storage(this);
  public extension = new Extension();
  public tabs = new Tabs(this);
  public webRequest = new WebRequest();
  public i18n = new I18n(this);
  public browserAction = new BrowserAction(this);

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    this.runtime = new Runtime(_manifest);
  }
}
