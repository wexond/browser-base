import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { StorageService } from '~/browser/services/storage';

export class HistoryAPI extends EventHandler {
  private get historyService() {
    return StorageService.instance.history;
  }

  constructor() {
    super('history', []);
  }

  public start() {
    const handler = HandlerFactory.create('history', this);

    handler('search', this.search);
    handler('getVisits', this.getVisits);
  }

  public search = (e, { query }) => this.historyService.search(query);

  public getVisits = (e, { details }) => this.historyService.getVisits(details);
}
