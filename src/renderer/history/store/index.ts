import { observable } from 'mobx';

import { GlobalAPI, HistoryItem, HistorySection } from '~/interfaces';
import { formatDate } from '~/utils/time';

/*
import { HistoryItem } from '~/interfaces/history-item';*/
/*import { HistorySection } from '~/interfaces/history-section';
import {  } from '~/interfaces/global-api';
*/
export class Store {
  public globalObject = global as GlobalAPI;

  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public historySections: HistorySection[] = [];

  @observable
  public selectedItems: string[] = [];

  public getById(id: string) {
    return this.historyItems.find(x => x._id === id);
  }

  public async loadHistory() {
    const items = await this.globalObject.getHistory();

    this.historyItems = items;
    this.loadSections();
  }

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

      const dateStr = formatDate(this.globalObject.dictionary, date);

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

  public addItem(item: HistoryItem) {}

  public removeItem(id: string) {}
}

export default new Store();
