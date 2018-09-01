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
  public historySections: HistorySection[] = [];

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
    for (let i = this.loadedCount; i < count + this.loadedCount; i++) {
      if (i < this.historyItems.length) {
        const item = this.historyItems[i];
        const date = new Date(item.date);

        const dateStr = formatDate(this.dictionary, date);

        const foundSection = this.historySections.find(x => x.date === dateStr);

        const newItem = {
          ...item,
          favicon: '', // store.faviconsStore.favicons[item.favicon]
          selected: false,
        };

        if (foundSection == null) {
          const section: HistorySection = {
            items: [newItem],
            date: dateStr,
            id: item._id,
          };

          this.historySections.push(section);
        } else {
          foundSection.items.push(newItem);
        }
      }
    }

    this.loadedCount += count;
  }
}

export default new Store();
