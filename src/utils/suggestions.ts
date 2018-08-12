import { isURL, requestURL } from '.';
import { icons } from '../defaults';
import { HistoryItem, SuggestionItem } from '../interfaces';
import store from '../renderer/store';

const countVisitedTimes = (historyItems: HistoryItem[]) => {
  const items: any[] = [];

  for (const historyItem of historyItems) {
    const itemsWithUrl = historyItems.filter(x => x.url === historyItem.url);

    const itemToPush = {
      id: historyItem.id,
      times: itemsWithUrl.length - 1,
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

  for (const item of store.historyItems) {
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
      const data = await requestURL(
        `http://google.com/complete/search?client=chrome&q=${input}`,
      );
      const json = JSON.parse(data);

      let suggestions: string[] = [];

      for (const item of json[1]) {
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

let searchSuggestions: SuggestionItem[] = [];

export const loadSuggestions = async (input: HTMLInputElement) =>
  new Promise(async (resolve: (suggestion: string) => void) => {
    const filter = input.value.substring(0, input.selectionStart);
    const dictionary = store.dictionary.suggestions;
    const history = getHistorySuggestions(filter);

    const historySuggestions: SuggestionItem[] = [];

    if ((!history[0] || !history[0].canSuggest) && filter.trim() !== '') {
      historySuggestions.unshift({
        primaryText: filter,
        secondaryText: dictionary.searchInGoogle,
        favicon: icons.search,
        isSearch: true,
      });
      if (isURL(filter)) {
        historySuggestions.unshift({
          primaryText: filter,
          secondaryText: dictionary.openWebsite,
          favicon: icons.page,
        });
      }
    }

    for (const item of history) {
      if (!item.isSearch) {
        historySuggestions.push({
          primaryText: item.url,
          secondaryText: item.title,
          favicon: store.favicons[item.favicon],
          canSuggest: item.canSuggest,
        });
      } else {
        historySuggestions.push({
          primaryText: item.url,
          secondaryText: dictionary.searchInGoogle,
          favicon: icons.search,
          canSuggest: item.canSuggest,
        });
      }
    }

    let suggestions: SuggestionItem[] =
      input.value === ''
        ? []
        : historySuggestions.concat(searchSuggestions).slice(0, 6);

    for (let i = 0; i < suggestions.length; i++) {
      suggestions[i].id = i;
    }

    store.suggestions = suggestions;

    if (historySuggestions.length > 0 && historySuggestions[0].canSuggest) {
      resolve(historySuggestions[0].primaryText);
    }

    const searchData = await getSearchSuggestions(filter);

    if (input.value.substring(0, input.selectionStart) === filter) {
      searchSuggestions = [];
      for (const item of searchData) {
        searchSuggestions.push({
          primaryText: item,
          favicon: icons.search,
          isSearch: true,
        });
      }

      suggestions =
        input.value === ''
          ? []
          : historySuggestions.concat(searchSuggestions).slice(0, 6);

      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].id = i;
      }

      store.suggestions = suggestions;
    }
  });
