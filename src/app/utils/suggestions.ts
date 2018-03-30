import { history, favicons } from '../utils/storage';

interface History {
  date: string;
  favicon: string;
  url: string;
  title: string;
  id: number;
}

interface Favicon {
  url: string;
  favicon: Buffer;
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

const countVisitedTimes = (filter: string, historyItems: History[]) => {
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

        let mostVisited: History[] = [];
        let fromHistory: History[] = [];

        const filterPart = filter.replace(regex, '');

        for (const hItem of historyItems) {
          const urlPart = hItem.url.replace(regex, '');

          if (urlPart.startsWith(filterPart)) {
            fromHistory.push(hItem);
            mostVisited.push(hItem);
          } else if (hItem.title.includes(filter)) {
            fromHistory.push(hItem);
          }
        }

        fromHistory = removeDuplicates(fromHistory, 'url');
        mostVisited = removeDuplicates(mostVisited, 'url');

        const visitedTimes = countVisitedTimes(filter, mostVisited);

        mostVisited = [];
        for (const item of visitedTimes) {
          const item2 = fromHistory.find(x => x.id === item.id);
          mostVisited.push(item2);
          fromHistory.splice(fromHistory.indexOf(item2), 1);
        }

        if (mostVisited[0] != null) {
          const split = mostVisited[0].url.split('/');
          const shortUrl = split[2];
          mostVisited.unshift({
            ...mostVisited[0],
            url: shortUrl,
          });

          if (
            split[3] == null ||
            (split[3] != null && (split[3].startsWith('?') || split[3] === ''))
          ) {
            mostVisited.splice(1, 1);
          }
        }

        mostVisited = mostVisited.slice(0, 3);
        mostVisited = mostVisited.sort((a: any, b: any) => a.url.length - b.url.length);
        mostVisited = mostVisited.filter(Boolean);

        mostVisited = removeDuplicates(mostVisited, 'title');

        fromHistory = fromHistory.slice(0, 5);
        fromHistory = removeDuplicates(fromHistory, 'title');

        resolve({
          history: fromHistory,
          mostVisited,
        });
      });
    });
  });
