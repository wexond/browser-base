import { observable } from 'mobx';
import store from '.';
import { HistoryItem, HistorySection } from '~/interfaces';
import { formatDate } from '~/utils';
import { databases } from '~/defaults/databases';

export class HistoryStore {
  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public historySections: HistorySection[] = [];

  @observable
  public selectedItems: string[] = [];

  public load() {
    return new Promise(async resolve => {
      databases.history.find({}, (err: any, items: HistoryItem[]) => {
        if (err) return console.warn(err);

        this.historyItems = items;
        this.historySections = this.getSections(
          this.getItems(store.menuStore.searchText),
        );

        resolve();
      });
    });
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

      const dateStr = formatDate(store.dictionary, date);

      const foundSection = sections.find(x => x.date === dateStr);

      const newItem = {
        ...item,
        favicon: store.faviconsStore.favicons[item.favicon],
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

  public removeItem(id: string) {
    // TODO: nedb
    /*store.historyItems = store.historyItems.filter(x => x.id !== id);
    database.history.delete(id);*/
  }
}
