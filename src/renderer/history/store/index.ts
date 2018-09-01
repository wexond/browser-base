import { observable } from 'mobx';

import { HistoryItem, HistorySection, Dictionary } from '~/interfaces';
import { formatDate } from '~/utils/time';

export class Store {
  @observable
  public loading = true;

  @observable
  public dictionary: Dictionary;

  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public historySections: HistorySection[] = [
    {
      date: new Date().toString(),
      id: '0wrwa',
      items: [],
    },
  ];

  public loadedCount = 0;

  public filterItems(filter = '') {
    this.historyItems = this.historyItems
      .filter(
        item =>
          item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
          item.url.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
      )
      .reverse();
  }

  public loadSections(count: number) {
    const section = this.historySections[0];

    for (let i = this.loadedCount; i < count + this.loadedCount; i++) {
      if (i < this.historyItems.length) {
        section.items.push(this.historyItems[i]);
      }
    }

    this.loadedCount += count;
  }
}

export default new Store();
