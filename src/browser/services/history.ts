import { StorageFactory } from '../storage-factory';
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

export class HistoryService extends HistoryServiceBase {
  private invoker = StorageFactory.create('history');

  public start() {
    extensions.history.start();
  }

  public search = (details: IHistorySearchDetails) =>
    this.invoker<IHistoryItem[]>('search', details);

  public getVisits = (details: IVisitsDetails) =>
    this.invoker<IVisitItem[]>('get-visits', details);

  public addUrl = (details: IHistoryAddDetails) =>
    this.invoker('add-url', details);

  public deleteUrl = (details: IHistoryAddDetails) =>
    this.invoker('delete-url', details);

  public deleteRange = (range: IHistoryDeleteRange) =>
    this.invoker('delete-range', range);

  public deleteAll = () => this.invoker('delete-all');
}
