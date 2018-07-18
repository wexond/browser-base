import Section from '../models/section';
import AppStore from '../../../app/store';
import HistoryStore from '../store';
import db from '../../../shared/models/app-database';
import { formatDate } from '../../../shared/utils/time';

export async function getHistorySections(itemsCount: number, filter = '') {
  return new Promise(async (resolve: (r: Section[]) => void) => {
    const sections: Section[] = [];

    const items = (await db.history.toArray()).reverse();

    const len = items.length < itemsCount ? items.length : itemsCount;

    for (let i = 0; i < len; i++) {
      const item = items[i];
      const date = new Date(item.date);

      const dateStr = formatDate(date);

      const foundSection = sections.find(x => x.date === dateStr);

      const newItem = {
        ...item,
        favicon: AppStore.favicons[item.favicon],
        selected: false,
      };

      if (
        newItem.title
          .toLowerCase()
          .trim()
          .indexOf(filter.toLowerCase().trim()) !== -1
        || newItem.url
          .toLowerCase()
          .trim()
          .indexOf(filter.toLowerCase().trim()) !== -1
      ) {
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
    }

    resolve(sections);
  });
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
