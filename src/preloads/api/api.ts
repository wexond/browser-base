import { Manifest } from '@/interfaces/extensions';
import { Runtime } from '.';
import { WebNavigation } from '~/preloads/api/web-navigation';

let manifest: Manifest;

export class API {
  public runtime = new Runtime(manifest);
  public webNavigation = new WebNavigation();

  // tslint:disable-next-line
  constructor(_manifest: Manifest) {
    manifest = _manifest;
  }
}
