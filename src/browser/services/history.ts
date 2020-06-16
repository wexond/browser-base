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
  private invoke = WorkerMessengerFactory.createInvoker(
    'history',
    Application.instance.storage.worker,
  );

  constructor() {
    super();
    extensions.history.start(this);
  }

  public search = (details: IHistorySearchDetails) =>
    this.invoke<IHistoryItem[]>('search', details);

  public getVisits = (details: IVisitsDetails) =>
    this.invoke<IVisitItem[]>('getVisits', details);

  public addUrl = (details: IHistoryAddDetails) =>
    this.invoke('addUrl', details);

  public addCustomUrl = (url: string, transition: PageTransition) =>
    this.invoke('addCustomUrl', url, transition);

  public deleteUrl = (details: IHistoryAddDetails) =>
    this.invoke('deleteUrl', details);

  public deleteRange = (range: IHistoryDeleteRange) =>
    this.invoke('deleteRange', range);

  public deleteAll = () => this.invoke('deleteAll');
}
