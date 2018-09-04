import { observable } from 'mobx';

import { HistoryItem } from '@/interfaces';
import { HistorySection } from '@/interfaces/history';
import { formatDate } from '@/utils/time';

export class Store {
  @observable
  public loading = true;

  @observable
  public dictionary: any;

  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public historySections: HistorySection[] = [];

  @observable
  public selectedItems: string[] = [];

  public loadedCount = 0;

  public validateItems(filter = '') {
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

        const foundSection = this.historySections.find(
          x => x.title === dateStr,
        );

        const newItem = {
          ...item,
          favicon: '', // store.faviconsStore.favicons[item.favicon]
          selected: false,
        };

        if (foundSection == null) {
          const section: HistorySection = {
            items: [newItem],
            title: dateStr,
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

  public search(filter: string) {
    if (filter === '') {
      this.historySections = [];
      this.loadedCount = 0;
      this.loadSections(20);

      return;
    }

    const foundItems = this.historyItems.filter(item =>
      item.title.toLowerCase().includes(filter),
    );

    if (foundItems.length === 0) return;

    const section: HistorySection = {
      id: foundItems[0]._id,
      title: `Search results for '${filter}'`,
      items: foundItems,
    };

    this.historySections = [section];
  }

  public removeItem(id: string) {
    console.log(id);
  }
}

export default new Store();
