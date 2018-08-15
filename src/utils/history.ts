import database from '../database';
import { HistoryItem, Section } from '../interfaces';
import store from '../renderer/store';
import { formatDate } from './time';

export const getHistoryItems = (filter = '') =>
  store.historyItems
    .filter(
      item =>
        item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
        item.url.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
    )
    .reverse();

export const getHistorySections = (items: HistoryItem[]) => {
  const sections: Section[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const date = new Date(item.date);

    const dateStr = formatDate(date);

    const foundSection = sections.find(x => x.date === dateStr);

    const newItem = {
      ...item,
      favicon: store.favicons[item.favicon],
      selected: false,
    };

    if (foundSection == null) {
      const section = {
        items: [newItem],
        date: dateStr,
        id: item.id,
      };
      sections.push(section);
    } else {
      foundSection.items.push(newItem);
    }
  }

  return sections;
};

export function deleteHistoryItem(id: number) {
  // TODO: nedb
  /*store.historyItems = store.historyItems.filter(x => x.id !== id);
  database.history.delete(id);*/
}
