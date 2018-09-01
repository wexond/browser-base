import { observable } from 'mobx';

import { HistoryItem, HistorySection, Dictionary } from '~/interfaces';
import { formatDate } from '~/utils/time';

export class Store {
  @observable
  public dictionary: Dictionary;

  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public historySections: HistorySection[] = [];

  @observable
  public selectedItems: string[] = [];

  public loadSections() {
    this.historySections = this.getSections(this.getItems());
  }

  public getItems(filter = '') {
    return this.historyItems
      .filter(
        item =>
          item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
          item.url.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
      )
      .reverse();
  }

  public getSections(items: HistoryItem[]) {
    const sections: HistorySection[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const date = new Date(item.date);

      const dateStr = formatDate(this.dictionary, date);

      const foundSection = sections.find(x => x.date === dateStr);

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
        sections.push(section);
      } else {
        foundSection.items.push(newItem);
      }
    }

    return sections;
  }
}

export default new Store();
