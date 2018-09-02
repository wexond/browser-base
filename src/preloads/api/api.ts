import { Manifest } from '@/interfaces/extensions';
import { Runtime, WebNavigation, Alarms, Storage, Extension, Tabs } from '.';
import { WebRequest } from '~/preloads/api/web-request';
import { I18n } from '~/preloads/api/i18n';

let manifest: Manifest;

// https://developer.chrome.com/extensions/api_index

export class API {
  public runtime = new Runtime(manifest);
  public webNavigation = new WebNavigation();
  public alarms = new Alarms(this);
  public storage = new Storage(this);
  public extension = new Extension();
  public tabs = new Tabs(this);
  public webRequest = new WebRequest();
  public i18n = new I18n(this);

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    manifest = _manifest;
  }
}
