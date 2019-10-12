import { IHistoryItem } from '~/interfaces';

export const countVisitedTimes = (hItems: IHistoryItem[]) => {
  const items: any[] = [];
  const historyItems = hItems.slice();

  for (const historyItem of historyItems) {
    const itemsWithUrl = historyItems.filter(
      x => x.url.replace(/\//g, '') === historyItem.url.replace(/\//g, ''),
    );

    const itemToPush = {
      times: itemsWithUrl.length,
      item: historyItem,
    };

    if (
      !items.find(
        x =>
          x.item.url.replace(/\//g, '') === historyItem.url.replace(/\//g, ''),
      )
    ) {
      items.push(itemToPush);
    }
  }

  return items.sort((a, b) => b.times - a.times);
};
