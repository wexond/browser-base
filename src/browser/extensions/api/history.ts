import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { HistoryService } from '~/browser/services/history';
import { PageTransition } from '~/interfaces';

export class HistoryAPI extends EventHandler {
  private service: HistoryService;

  constructor() {
    super('history', ['onVisited', 'onVisitRemoved']);
  }

  public start(service: HistoryService) {
    this.service = service;

    const handler = HandlerFactory.create('history', this);

    handler('search', this.search);
    handler('getVisits', this.getVisits);
    handler('addUrl', this.addUrl);
    handler('deleteUrl', this.deleteUrl);
    handler('deleteRange', this.deleteRange);
    handler('deleteAll', this.deleteAll);

    this.handleEvents(this.service, {
      visitRemoved: 'onVisitRemoved',
    });
  }

  public search = (e, { query }) => this.service.search(query);

  public getVisits = (e, { details }) => this.service.getVisits(details);

  public addUrl = (e, { details }) =>
    this.service.addUrl({
      url: details.url,
      transition: PageTransition.PAGE_TRANSITION_LINK,
    });

  public deleteUrl = (e, { details }) => this.service.deleteUrl(details);

  public deleteRange = (e, { range }) => this.service.deleteRange(range);

  public deleteAll = () => this.service.deleteAll();
}
