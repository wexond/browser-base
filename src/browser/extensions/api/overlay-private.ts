import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { OverlayService } from '~/browser/services/overlay';

export class OverlayPrivateAPI extends EventHandler {
  private service: OverlayService;

  constructor() {
    super('overlayPrivate', ['onPopupUpdated', 'onRegionsUpdated']);
  }

  public start(service: OverlayService) {
    this.service = service;

    const handler = HandlerFactory.create('overlayPrivate', this);

    handler('updatePopup', this.updatePopup);
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

  public updatePopup(
    {}: ISenderDetails,
    { name, info }: { name: string; info: browser.overlayPrivate.PopupInfo },
  ) {
    this.sendEventToAll('onPopupUpdated', name, info);
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
