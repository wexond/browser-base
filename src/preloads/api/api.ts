import { Manifest } from '@/interfaces/extensions';
import { Runtime, WebNavigation, Alarms, Storage } from '.';

let manifest: Manifest;

export class API {
  public runtime = new Runtime(manifest);
  public webNavigation = new WebNavigation();
  public alarms = new Alarms(this);
  public storage = new Storage(this);

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    manifest = _manifest;
  }
}
