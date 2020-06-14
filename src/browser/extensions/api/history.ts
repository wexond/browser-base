import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { StorageService } from '~/browser/services/storage';

export class HistoryAPI extends EventHandler {
  private get historyService() {
    return StorageService.instance.history;
  }

  constructor() {
    super('history', ['onVisited', 'onVisitRemoved']);
  }

  public start() {
    const handler = HandlerFactory.create('history', this);

    handler('search', this.search);
    handler('getVisits', this.getVisits);
    handler('addUrl', this.addUrl);
    handler('deleteUrl', this.deleteUrl);
    handler('deleteRange', this.deleteRange);
    handler('deleteAll', this.deleteAll);

    this.handleEvents(this.historyService, {
      visitRemoved: 'onVisitRemoved',
    });
  }

  public search = (e, { query }) => this.historyService.search(query);

  public getVisits = (e, { details }) => this.historyService.getVisits(details);

  public addUrl = (e, { details }) => this.historyService.addUrl(details);

  public deleteUrl = (e, { details }) => this.historyService.deleteUrl(details);

  public deleteRange = (e, { range }) => this.historyService.deleteRange(range);

  public deleteAll = () => this.historyService.deleteAll();
}
