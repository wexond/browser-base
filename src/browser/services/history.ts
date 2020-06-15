import { StorageInvokerFactory } from '../storage-factory';
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

export class HistoryService extends HistoryServiceBase {
  private invoker = StorageInvokerFactory.create('history');

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
