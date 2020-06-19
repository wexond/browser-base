import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { OverlayService } from '~/browser/services/overlay';

export class OverlayPrivateAPI extends EventHandler {
  private service: OverlayService;

  constructor() {
    super('overlayPrivate', ['onPopupToggled', 'onRegionsUpdated', 'onBlur']);
  }

  public start(service: OverlayService) {
    this.service = service;

    const handler = HandlerFactory.create('overlayPrivate', this);

    handler('setPopupVisible', this.setPopupVisible);
    handler('setRegions', this.setRegions);
    handler('getRegions', this.getRegions);
    handler('setIgnoreMouseEvents', this.setIgnoreMouseEvents);
  }

  public setIgnoreMouseEvents(
    { sender }: ISenderDetails,
    { flag }: { flag: boolean },
  ) {
    this.service.fromWebContents(sender)?.setIgnoreMouseEvents(flag);
  }

  public setPopupVisible(
    { sender }: ISenderDetails,
    { name, visible }: { name: string; visible: boolean },
  ) {
    this.service.fromWebContents(sender)?.setPopupVisible(name, visible);
  }

  public getRegions({ sender }: ISenderDetails) {
    return this.service.fromWebContents(sender)?.regions;
  }

  public setRegions(
    { sender }: ISenderDetails,
    { regions }: { regions: number[][] },
  ) {
    const overlay = this.service.fromWebContents(sender);
    if (!overlay) return;

    overlay.regions = regions;

    this.sendEventToAll('onRegionsUpdated', regions);
  }
}
