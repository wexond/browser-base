import { HistoryItem } from '../models';
import store from '../store';
import { requestURL } from './network';

export const countVisitedTimes = (hItems: HistoryItem[]) => {
  const items: any[] = [];
  const historyItems = hItems.slice();

  for (const historyItem of historyItems) {
    const itemsWithUrl = historyItems.filter(
      x => x.url.replace('/', '') === historyItem.url.replace('/', ''),
    );

    const itemToPush = {
      times: itemsWithUrl.length,
      item: historyItem,
    };

    for (const item of itemsWithUrl) {
      if (item !== historyItem) {
        historyItems.splice(historyItems.indexOf(item), 1);
      }
    }

    items.push(itemToPush);
  }

  return items.sort((a, b) => b.times - a.times);
};

interface HistorySuggestion extends HistoryItem {
  canSuggest?: boolean;
  isSearch?: boolean;
}

export const getHistorySuggestions = (filter: string) => {
  filter = filter.trim().toLowerCase();

  if (filter === '') {
    return [];
  }

  const regex = /(http(s?)):\/\/(www.)?|www./gi;

  let historyItems: HistorySuggestion[] = [];
  const urlMatchedItems: HistorySuggestion[] = [];
  const titleMatchedItems: HistorySuggestion[] = [];

  const filterPart = filter.replace(regex, '');

  for (const item of store.history.items) {
    let urlPart = item.url.replace(regex, '');

    if (urlPart.endsWith('/')) {
      urlPart = urlPart.slice(0, -1);
    }

    const itemToPush = {
      ...item,
      url: urlPart,
    };

    if (urlPart.indexOf('search?') !== -1) {
      const query = urlPart
        .split('q=')[1]
        .split('&')[0]
        .replace(/\+/g, ' ')
        .replace(/%20/g, ' ');
      if (
        query.startsWith(filterPart) &&
        urlMatchedItems.filter(x => x.url === query).length === 0
      ) {
        itemToPush.url = query;
        urlMatchedItems.push({ url: query, canSuggest: true, isSearch: true });
      }
    } else if (
      urlPart.toLowerCase().startsWith(filterPart) ||
      `www.${urlPart}`.startsWith(filterPart)
    ) {
      urlMatchedItems.push({ ...itemToPush, canSuggest: true });
    } else if (itemToPush.title.toLowerCase().includes(filter)) {
      titleMatchedItems.push({ ...itemToPush, canSuggest: false });
    }
  }

  let visitedTimes = countVisitedTimes(urlMatchedItems)
    .filter(Boolean)
    .slice(0, 5);

  historyItems = [];

  for (const item of visitedTimes) {
    historyItems.push(item.item);
  }

  visitedTimes = countVisitedTimes(titleMatchedItems)
    .filter(Boolean)
    .slice(0, 5);

  for (const item of visitedTimes) {
    historyItems.push(item.item);
  }

  return historyItems.slice(0, 5);
};

export const getSearchSuggestions = (filter: string) =>
  // eslint-disable-next-line
  new Promise(async (resolve: (suggestions: string[]) => void, reject) => {
    const input = filter.trim().toLowerCase();

    if (input === '') {
      return resolve([]);
    }

    try {
      const data = JSON.parse(
        (await requestURL(
          `http://google.com/complete/search?client=chrome&q=${encodeURIComponent(
            input,
          )}`,
        )).data,
      );

      let suggestions: string[] = [];

      for (const item of data[1]) {
        if (suggestions.indexOf(item) === -1) {
          suggestions.push(String(item).toLowerCase());
        }
      }

      // Sort suggestions array by length.
      suggestions = suggestions.sort((a, b) => a.length - b.length).slice(0, 5);

      resolve(suggestions);
    } catch (e) {
      reject(e);
    }
  });
