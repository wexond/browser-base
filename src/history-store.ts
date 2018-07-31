import { observable } from 'mobx';
import Section from './models/section';
import HistoryItem from '../../shared/models/history-item';

class Store {
  @observable public sections: Section[] = [];

  @observable public selectedItems: number[] = [];

  @observable public cmdPressed: boolean = false;

  public allSections: Section[] = [];

  public historyItems: HistoryItem[] = [];

  public itemsLimit = 20;
}

export default new Store();
