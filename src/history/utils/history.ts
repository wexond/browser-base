import HistoryItem from '../models/history-item';
import Section from '../models/section';

export function getSections(history: HistoryItem[]) {
  const sections: Section[] = [];

  let id = 0;

  for (const item of history) {
    const date = new Date(item.date);

    const year = date
      .getFullYear()
      .toString()
      .padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDay() + 1).toString().padStart(2, '0');

    const dateStr = `${year}-${month}-${day}`;

    const foundSection = sections.find(x => x.date === dateStr);

    if (foundSection == null) {
      const section = {
        items: [item],
        date: dateStr,
        id: id++,
      };
      sections.push(section);
    } else {
      foundSection.items.push(item);
    }
  }

  return sections;
}
