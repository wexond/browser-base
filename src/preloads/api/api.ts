import { Manifest } from '@/interfaces/extensions';
import { Runtime, WebNavigation, Alarms, Storage, Extension, Tabs } from '.';
import { WebRequest } from '~/preloads/api/web-request';

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

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    manifest = _manifest;
  }
}
