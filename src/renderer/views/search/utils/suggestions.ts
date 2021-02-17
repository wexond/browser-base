import { networkMainChannel } from '~/common/rpc/network';
import { IHistoryItem } from '~/interfaces';

import store from '../store';

interface HistorySuggestion extends IHistoryItem {
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

  for (const item of store.visitedItems) {
    let urlPart = item.url.replace(regex, '');

    if (urlPart.endsWith('/')) {
      urlPart = urlPart.slice(0, -1);
    }

    const itemToPush = {
      ...item,
      url: urlPart,
    };

    if (
      urlPart.indexOf(
        store.searchEngine.url.replace('%s', '').replace(regex, ''),
      ) !== -1
    ) {
      const query = urlPart
        .split('q=')[1]
        .split('&')[0]
        .replace(/\+/g, ' ')
        .replace(/%20/g, ' ');
      if (
        query.startsWith(filter) &&
        urlMatchedItems.filter((x) => x.url === query).length === 0
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

  let visitedTimes = urlMatchedItems.slice(0, 6);

  historyItems = [];

  for (const item of visitedTimes) {
    historyItems.push(item);
  }

  visitedTimes = titleMatchedItems.slice(0, 6);

  for (const item of visitedTimes) {
    historyItems.push(item);
  }

  return historyItems.slice(0, 6);
};

export const getSearchSuggestions = (filter: string) =>
  // eslint-disable-next-line
  new Promise(async (resolve: (suggestions: string[]) => void, reject) => {
    const input = filter.trim().toLowerCase();

    if (input === '') {
      return resolve([]);
    }

    try {
      if (store.searchEngine.keywordsUrl === '')
        return reject(new Error('No search engine keyword URL specified'));

      const data = JSON.parse(
        (
          await networkMainChannel
            .getInvoker()
            .request(
              store.searchEngine.keywordsUrl.replace(
                '%s',
                encodeURIComponent(input),
              ),
            )
        ).data,
      );

      let suggestions: string[] = [];

      for (const item of data[1]) {
        if (suggestions.indexOf(item) === -1) {
          suggestions.push(String(item).toLowerCase());
        }
      }

      // Sort suggestions array by length.
      suggestions = suggestions.sort((a, b) => a.length - b.length).slice(0, 6);

      resolve(suggestions);
    } catch (e) {
      reject(e);
    }
  });
