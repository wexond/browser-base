import Section from '../models/section';
import AppStore from '../../../app/store';
import HistoryStore from '../store';
import db from '../../../shared/models/app-database';

export async function getHistorySections(filter = '') {
  return new Promise(async (resolve: (r: Section[]) => void) => {
    const sections: Section[] = [];

    const items = await db.history.toArray();

    const len = items.length < 20 ? items.length : 20;

    for (let i = 0; i < len; i++) {
      const item = items[i];
      const date = new Date(item.date);

      const year = date
        .getFullYear()
        .toString()
        .padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = (date.getDay() + 1).toString().padStart(2, '0');

      const dateStr = `${year}-${month}-${day}`;

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
          sections.unshift(section);
        } else {
          foundSection.items.unshift(newItem);
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
