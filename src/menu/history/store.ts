import { observable } from 'mobx';
import Section from './models/section';
import HistoryItem from '../../shared/models/history-item';

class Store {
  @observable public sections: Section[] = [];

  @observable public selectedItems: number[] = [];

  public allSections: Section[] = [];

  public historyItems: HistoryItem[] = [];

  public itemsLimit = 20;
}

export default new Store();
