import {
  IVisitsDetails,
  IVisitItem,
  IHistorySearchDetails,
  IHistoryItem,
  IHistoryAddDetails,
  IHistoryDeleteRange,
  PageTransition,
} from '~/interfaces';
import { extensions } from '../extensions';
import { HistoryServiceBase } from '~/common/services/history';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { Application } from '../application';

export class HistoryService extends HistoryServiceBase {
  private invoker = WorkerMessengerFactory.createInvoker(
    'history',
    Application.instance.storage.worker,
  );

  private constructor() {
    super();
    extensions.history.start(this);
  }

  public static start() {
    return new HistoryService();
  }

  public search = (details: IHistorySearchDetails) =>
    this.invoker<IHistoryItem[]>('search', details);

  public getVisits = (details: IVisitsDetails) =>
    this.invoker<IVisitItem[]>('getVisits', details);

  public addUrl = (details: IHistoryAddDetails) =>
    this.invoker('addUrl', details);

  public addCustomUrl = (url: string, transition: PageTransition) =>
    this.invoker('addCustomUrl', url, transition);

  public deleteUrl = (details: IHistoryAddDetails) =>
    this.invoker('deleteUrl', details);

  public deleteRange = (range: IHistoryDeleteRange) =>
    this.invoker('deleteRange', range);

  public deleteAll = () => this.invoker('deleteAll');
}
