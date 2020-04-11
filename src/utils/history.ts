import { IHistoryItem, IVisitedItem } from '~/interfaces';

export const countVisitedTimes = (hItems: IHistoryItem[]): IVisitedItem[] => {
  const items: IVisitedItem[] = [];
  const historyItems = hItems.slice();

  for (const historyItem of historyItems) {
    const itemsWithUrl = historyItems.filter(
      (x) => x.url.replace(/\//g, '') === historyItem.url.replace(/\//g, ''),
    );

    const itemToPush = {
      times: itemsWithUrl.length,
      ...historyItem,
    };

    if (
      !items.find(
        (x) => x.url.replace(/\//g, '') === historyItem.url.replace(/\//g, ''),
      )
    ) {
      if (itemToPush.favicon === '') {
        const item = itemsWithUrl.find((x) => x.favicon !== '');
        if (item) {
          itemToPush.favicon = item.favicon;
        }
      }
      items.push(itemToPush);
    }
  }

  return items.sort((a, b) => b.times - a.times);
};
