import store from '../store';
import HistoryItem from '../models/history-item';
import database from '../database';
import { requestURL } from './network';
import { isURL } from './url';
import SuggestionItem from '../models/suggestion-item';

const removeDuplicates = (array: any[], param: string) => {
  const tempArray = array.slice();
  array = [];
  // Remove duplicates from array.
  const seenItems = [];
  for (let i = 0; i < tempArray.length; i++) {
    if (seenItems.indexOf(tempArray[i][param]) === -1) {
      array.push(tempArray[i]);
      seenItems.push(tempArray[i][param]);
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
      url: hitem.url,
    };

    let next = true;

    for (const item of items) {
      if (item.url === hitem.url) {
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

type HistorySuggestions = {
  history: HistoryItem[];
  mostVisited: HistoryItem[];
};

export const getHistorySuggestions = (filter: string) =>
  new Promise((resolve: (suggestions: HistorySuggestions) => void, reject) => {
    filter = filter.trim().toLowerCase();

    if (filter === '') resolve({ history: [], mostVisited: [] });

    const regex = /(http(s?)):\/\/(www.)?|www./gi;

    let mostVisited: HistoryItem[] = [];
    let fromHistory: HistoryItem[] = [];

    const filterPart = filter.replace(regex, '');

    database.history
      .each(item => {
        let urlPart = item.url.replace(regex, '');

        if (urlPart.endsWith('/')) {
          urlPart = urlPart.slice(0, -1);
        }

        const itemToPush = {
          ...item,
          url: urlPart,
        };

        if (
          urlPart.toLowerCase().startsWith(filterPart)
          || `www.${urlPart}`.startsWith(filterPart)
        ) {
          fromHistory.push(itemToPush);
          mostVisited.push(itemToPush);
        } else if (itemToPush.title.toLowerCase().includes(filter)) {
          fromHistory.push(itemToPush);
        }
      })
      .then(() => {
        fromHistory = removeDuplicates(fromHistory, 'url');
        mostVisited = removeDuplicates(mostVisited, 'url');

        for (const item of mostVisited) {
          if (item.favicon != null) {
            mostVisited.unshift(item);
            mostVisited.splice(mostVisited.indexOf(item), 1);
          }
        }

        let visitedTimes = countVisitedTimes(mostVisited);

        visitedTimes = visitedTimes.sort((a, b) => a.url.length - b.url.length).filter(Boolean);

        mostVisited = [];
        for (let i = 0; i < 2; i++) {
          const item = visitedTimes[i];
          if (item) {
            const hItem = fromHistory.find(x => x.id === item.id);
            mostVisited.push(hItem);
            fromHistory.splice(fromHistory.indexOf(hItem), 1);
          }
        }

        // Get short domain from URL.
        if (mostVisited[0] != null) {
          const split = mostVisited[0].url.split('/');

          let splitIndex = 0;
          let shortUrl = split[0];

          if (mostVisited[0].url.includes('://')) {
            shortUrl = mostVisited[0].url;
            splitIndex = 2;
          }

          if (
            split[splitIndex + 1] == null
            || (split[splitIndex + 1] != null
              && (split[splitIndex + 1].startsWith('?') || split[splitIndex + 1] === '')
              && filterPart !== '')
          ) {
            mostVisited.unshift({
              ...mostVisited[0],
              url: shortUrl,
            });
            mostVisited.splice(1, 1);
          }
        }

        mostVisited = mostVisited.sort((a, b) => a.url.length - b.url.length).filter(Boolean);
        fromHistory = fromHistory.sort((a, b) => a.url.length - b.url.length).slice(0, 4);

        fromHistory = removeDuplicates(fromHistory, 'title');

        resolve({
          history: fromHistory,
          mostVisited,
        });
      });
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
      suggestions = suggestions.sort((a, b) => a.length - b.length).slice(0, 4);

      resolve(suggestions);
    } catch (e) {
      reject(e);
    }
  });

let searchSuggestions: SuggestionItem[] = [];

export const loadSuggestions = async (input: HTMLInputElement) =>
  new Promise(async resolve => {
    const filter = input.value.substring(0, input.selectionStart);

    const dictionary = store.dictionary.suggestions;
    const suggestions = await getHistorySuggestions(filter);

    store.loadFavicons();

    const historySuggestions: SuggestionItem[] = [];

    let id = 0;

    if (suggestions.mostVisited.length === 0 && filter.trim() !== '') {
      historySuggestions.unshift({
        primaryText: filter,
        secondaryText: dictionary.searchInGoogle,
        type: 'no-subheader-search',
        id: 0,
      });
      id = 1;
      if (isURL(filter)) {
        historySuggestions[0].id = 1;
        historySuggestions.unshift({
          primaryText: filter,
          secondaryText: dictionary.openWebsite,
          type: 'no-subheader-website',
          id: 0,
        });
        id = 2;
      }
    }

    for (const item of suggestions.mostVisited) {
      historySuggestions.push({
        primaryText: item.title,
        secondaryText: item.url,
        favicon: store.favicons[item.favicon],
        type: 'most-visited',
        id: id++,
      });
    }

    for (const item of suggestions.history) {
      historySuggestions.push({
        primaryText: item.title,
        secondaryText: item.url,
        favicon: store.favicons[item.favicon],
        type: 'history',
        id: id++,
      });
    }

    store.suggestions = input.value === '' ? [] : searchSuggestions.concat(historySuggestions);

    resolve();

    const searchData = await getSearchSuggestions(filter);

    searchSuggestions = [];
    for (const item of searchData) {
      searchSuggestions.push({
        primaryText: item,
        type: 'search',
        id: id++,
      });
    }

    store.suggestions = input.value === '' ? [] : historySuggestions.concat(searchSuggestions);
  });
