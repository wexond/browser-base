import { history } from '../utils/storage';
import { requestURL } from './network';

interface History {
  date: string;
  favicon: string;
  url: string;
  title: string;
  id: number;
}

interface Search {
  title: string;
}

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

const countVisitedTimes = (historyItems: History[]) => {
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
  history: History[];
  mostVisited: History[];
};

export const getHistorySuggestions = (filter: string) =>
  new Promise((resolve: (suggestions: HistorySuggestions) => void, reject) => {
    filter = filter.trim().toLowerCase();

    if (filter === '') resolve({ history: [], mostVisited: [] });

    history.all('SELECT * FROM history', (err: any, historyItems: History[]) => {
      if (err) reject(err);

      const regex = /(http(s?)):\/\/(www.)?|www./gi;

      let mostVisited: History[] = [];
      let fromHistory: History[] = [];

      const filterPart = filter.replace(regex, '');

      for (const hItem of historyItems) {
        let urlPart = hItem.url.replace(regex, '');

        if (urlPart.endsWith('/')) {
          urlPart = urlPart.slice(0, -1);
        }

        const itemToPush = {
          ...hItem,
          url: urlPart,
        };

        if (
          urlPart.toLowerCase().startsWith(filterPart) ||
          `www.${urlPart}`.startsWith(filterPart)
        ) {
          fromHistory.push(itemToPush);
          mostVisited.push(itemToPush);
        } else if (itemToPush.title.toLowerCase().includes(filter)) {
          fromHistory.push(itemToPush);
        }
      }

      fromHistory = removeDuplicates(fromHistory, 'url');
      mostVisited = removeDuplicates(mostVisited, 'url');

      const visitedTimes = countVisitedTimes(mostVisited);

      mostVisited = [];
      for (let i = 0; i < 2; i++) {
        const item = visitedTimes[i];
        if (item) {
          const hItem = fromHistory.find(x => x.id === item.id);
          mostVisited.push(hItem);
          fromHistory.splice(fromHistory.indexOf(hItem), 1);
        }
      }

      if (mostVisited[0] != null) {
        const split = mostVisited[0].url.split('/');

        let splitIndex = 0;
        let shortUrl = split[0];

        if (mostVisited[0].url.includes('://')) {
          shortUrl = mostVisited[0].url;
          splitIndex = 2;
        }

        if (
          split[splitIndex + 1] == null ||
          (split[splitIndex + 1] != null &&
            (split[splitIndex + 1].startsWith('?') || split[splitIndex + 1] === '') &&
            filterPart !== '')
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
      mostVisited = removeDuplicates(mostVisited, 'title');

      resolve({
        history: fromHistory,
        mostVisited,
      });
    });
  });

export const getSearchSuggestions = (filter: string) =>
  // eslint-disable-next-line
  new Promise(async (resolve: (suggestions: Search[]) => void, reject) => {
    const input = filter.trim().toLowerCase();

    if (input === '') return resolve([]);

    try {
      const data = await requestURL(`http://google.com/complete/search?client=chrome&q=${input}`);
      const json = JSON.parse(data);

      let suggestions: Search[] = [];

      for (const item of json[1]) {
        if (suggestions.indexOf(item) === -1) {
          suggestions.push({
            title: String(item).toLowerCase(),
          });
        }
      }

      // Sort suggestions array by length.
      suggestions = suggestions.sort((a, b) => a.title.length - b.title.length).slice(0, 4);

      resolve(suggestions);
    } catch (e) {
      reject(e);
    }
  });
