import { history, favicons } from '../utils/storage';

const levenshtein = require('js-levenshtein');

interface History {
  date: string;
  favicon: string;
  url: string;
  title: string;
}

interface Favicon {
  url: string;
  favicon: Buffer;
}

const countVisitedTimes = (filter: string, historyItems: History[]) => {
  const items: any[] = [];

  for (const hitem of historyItems) {
    const itemToPush = {
      id: historyItems.indexOf(hitem),
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

  return items.sort((a: any, b: any) => a.times - b.times);
};

type historySuggestions = { history: History[]; mostVisited: History[] }; // eslint-disable-line

export const getHistorySuggestions = (filter: string) =>
  new Promise((resolve: (suggestions: historySuggestions) => void, reject) => {
    filter = filter.trim().toLowerCase();

    if (filter === '') resolve({ history: [], mostVisited: [] } as historySuggestions);

    history.all('SELECT * FROM history', (err: any, historyItems: History[]) => {
      if (err) reject(err);
      favicons.all('SELECT * FROM favicons', (err1: any, faviconItems: Favicon[]) => {
        if (err1) reject(err1);

        const regex = /(http(s?)):\/\/(www.)?|www./gi;

        const mostVisited: History[] = [];
        const fromHistory: History[] = [];

        const filterPart = filter.replace(regex, '');

        for (const hItem of historyItems) {
          const urlPart = hItem.url.replace(regex, '');

          if (
            urlPart.startsWith(filterPart) ||
            levenshtein(hItem.title, filter) <= 4 ||
            hItem.title.includes(filter)
          ) {
            fromHistory.push(hItem);
          }
        }

        const visitedTimes = countVisitedTimes(filter, fromHistory);

        for (const item of visitedTimes) {
          mostVisited.push(fromHistory[item.id]);
        }

        resolve({
          history: fromHistory,
          mostVisited: mostVisited.slice(0, 3),
        });
      });
    });
  });
