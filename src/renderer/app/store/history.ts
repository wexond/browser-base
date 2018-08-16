import { observable } from 'mobx';

export class HistoryStore {
  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public selectedItems: number[] = [];
}
