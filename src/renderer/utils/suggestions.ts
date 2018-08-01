import store from '../store';
import HistoryItem from '../models/history-item';
import database from '../database';
import { requestURL } from './network';
import { isURL } from './url';
import SuggestionItem from '../models/suggestion-item';
import icons from '../defaults/icons';

const removeDuplicates = (array: any[], param: string) => {
  const tempArray = array.slice();
  array = [];
  // Remove duplicates from array.
  const seenItems = [];
  for (let i = 0; i < tempArray.length; i++) {
    const value = tempArray[i][param].replace(/\//g, '');
    if (seenItems.indexOf(value) === -1) {
      array.push(tempArray[i]);
      seenItems.push(value);
    }
  }

  return array;
};

const countVisitedTimes = (historyItems: HistoryItem[]) => {
  const items: any[] = [];

  for (const hitem of historyItems) {
    const itemToPush = {
      id: hitem.id,
      times: 1,
      item: hitem,
    };

    let next = true;

    for (const item of items) {
      if (item.item.url === hitem.url) {
        next = false;
        break;
      }
    }

    if (next) {
      for (const hitem2 of historyItems) {
        if (hitem2.url === hitem.url) {
          itemToPush.times++;
        }
      }

      items.push(itemToPush);
    }
  }

  return items.sort((a, b) => a.times - b.times);
};

interface HistorySuggestion extends HistoryItem {
  canSuggest?: boolean;
}

export const getHistorySuggestions = (filter: string) =>
  new Promise(async (resolve: (suggestions: HistorySuggestion[]) => void, reject) => {
    filter = filter.trim().toLowerCase();

    if (filter === '') resolve([]);

    const regex = /(http(s?)):\/\/(www.)?|www./gi;

    let historyItems: HistorySuggestion[] = [];

    const filterPart = filter.replace(regex, '');

    await database.history.each(item => {
      let urlPart = item.url.replace(regex, '');

      if (urlPart.endsWith('/')) {
        urlPart = urlPart.slice(0, -1);
      }

      const itemToPush = {
        ...item,
        url: urlPart,
      };

      if (urlPart.toLowerCase().startsWith(filterPart) || `www.${urlPart}`.startsWith(filterPart)) {
        historyItems.push({ ...itemToPush, canSuggest: true });
      } else if (itemToPush.title.toLowerCase().includes(filter)) {
        historyItems.push({ ...itemToPush, canSuggest: false });
      }
    });

    const visitedTimes = countVisitedTimes(removeDuplicates(historyItems, 'url'))
      .filter(Boolean)
      .slice(0, 5);

    historyItems = [];

    for (const item of visitedTimes) {
      historyItems.push(item.item);
    }

    resolve(historyItems);
  });

export const getSearchSuggestions = (filter: string) =>
  // eslint-disable-next-line
  new Promise(async (resolve: (suggestions: string[]) => void, reject) => {
    const input = filter.trim().toLowerCase();

    if (input === '') return resolve([]);

    try {
      const data = await requestURL(`http://google.com/complete/search?client=chrome&q=${input}`);
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
  new Promise(async (resolve: (suggestion: SuggestionItem) => void) => {
    const filter = input.value.substring(0, input.selectionStart);
    const dictionary = store.dictionary.suggestions;
    const history = await getHistorySuggestions(filter);

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
      historySuggestions.push({
        primaryText: item.title,
        secondaryText: item.url,
        favicon: store.favicons[item.favicon],
        canSuggest: item.canSuggest,
      });
    }

    const suggestions = input.value === '' ? [] : historySuggestions.concat(searchSuggestions);

    let id = 0;

    for (const suggestion of suggestions) {
      suggestion.id = id++;
    }

    if (historySuggestions.length > 0 && historySuggestions[0].canSuggest) {
      resolve(historySuggestions[0]);
    }

    const searchData = await getSearchSuggestions(filter);

    searchSuggestions = [];
    for (const item of searchData) {
      searchSuggestions.push({
        primaryText: item,
        id: id++,
        favicon: icons.search,
        isSearch: true,
      });
    }

    store.suggestions = input.value === '' ? [] : historySuggestions.concat(searchSuggestions);
  });
