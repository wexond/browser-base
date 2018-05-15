import Section from '../models/section';
import HistoryItem from '../../../shared/models/history-item';
import AppStore from '../../../app/store';
import db from '../../../shared/models/app-database';

export function getSections() {
  const sections: Section[] = [];

  let id = 0;

  db.history.each(item => {
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
    };

    if (foundSection == null) {
      const section = {
        items: [newItem],
        date: dateStr,
        id: id++,
      };
      sections.push(section);
    } else {
      foundSection.items.push(newItem);
    }
  });

  return sections;
}
