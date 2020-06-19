import {
  IVisitsDetails,
  IVisitItem,
  IHistorySearchDetails,
  IHistoryItem,
  IHistoryAddDetails,
  IHistoryDeleteRange,
} from '~/interfaces';
import { extensions } from '../extensions';
import { HistoryServiceBase } from '~/common/services/history';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { Worker } from 'worker_threads';

export class HistoryService extends HistoryServiceBase {
  private invoker = WorkerMessengerFactory.createInvoker('history');

  constructor(worker: Worker) {
    super();
    this.invoker.initialize(worker);
    extensions.history.start(this);
  }

  public search = (details: IHistorySearchDetails) =>
    this.invoker.invoke<IHistoryItem[]>('search', details);

  public getVisits = (details: IVisitsDetails) =>
    this.invoker.invoke<IVisitItem[]>('getVisits', details);

  public addUrl = (details: IHistoryAddDetails) =>
    this.invoker.invoke('addUrl', details);

  public deleteUrl = (details: IHistoryAddDetails) =>
    this.invoker.invoke('deleteUrl', details);

  public deleteRange = (range: IHistoryDeleteRange) =>
    this.invoker.invoke('deleteRange', range);

  public deleteAll = () => this.invoker.invoke('deleteAll');
}
