import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { HistoryService } from '~/browser/services/history';

export class HistoryPrivateAPI extends EventHandler {
  private service: HistoryService;

  constructor() {
    super('historyPrivate', []);
  }

  public start(service: HistoryService) {
    this.service = service;

    const handler = HandlerFactory.create('historyPrivate', this);

    handler('getChunk', this.getChunk);
  }

  public getChunk = (e, { details }) => this.service.getChunk(details);
}
