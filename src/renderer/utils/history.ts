import Section from '../models/section';
import AppStore from '../../../app/store';
import HistoryStore from '../store';
import db from '../../../shared/models/app-database';
import { formatDate } from '../../../shared/utils/time';
import HistoryItem from '../../../shared/models/history-item';

export async function getHistoryItems(filter = '') {
  return new Promise(async (resolve: (r: HistoryItem[]) => void) => {
    const items = (await db.history
      .filter(
        item =>
          item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1
          || item.url.toLowerCase().indexOf(filter.toLowerCase()) !== -1,
      )
      .toArray()).reverse();

    resolve(items);
  });
}

export async function getHistorySections(items: HistoryItem[]) {
  const sections: Section[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const date = new Date(item.date);

    const dateStr = formatDate(date);

    const foundSection = sections.find(x => x.date === dateStr);

    const newItem = {
      ...item,
      favicon: AppStore.favicons[item.favicon],
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
}

export function deleteHistoryItem(id: number) {
  const { sections } = HistoryStore;
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const itm = section.items.find(x => x.id === id);
    if (itm) {
      section.items.splice(section.items.indexOf(itm), 1);
      if (section.items.length === 0) {
        sections.splice(i, 1);
      }
      break;
    }
  }

  db.history.delete(id);
}
