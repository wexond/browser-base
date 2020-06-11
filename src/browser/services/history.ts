import { StorageFactory } from '../storage-factory';
import {
  IVisitsDetails,
  IVisitItem,
  IHistorySearchDetails,
  IHistoryItem,
} from '~/interfaces';
import { extensions } from '../extensions';

export class HistoryService {
  private invoker = StorageFactory.create('history');

  public start() {
    extensions.history.start();
  }

  public search = (details: IHistorySearchDetails) =>
    this.invoker<IHistoryItem[]>('search', details);

  public getVisits = (details: IVisitsDetails) =>
    this.invoker<IVisitItem[]>('get-visits', details);
}
