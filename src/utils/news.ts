import { NewsCategories } from 'enums';
import { hasSubdomain, removeSubdomain, requestURL } from './network';
import { NEWS_API_KEY } from 'constants/';

export const getNews = async (
  country: string,
  category: NewsCategories = NewsCategories.General,
  newsCount: number = 100,
  apiKey: string = NEWS_API_KEY,
) => {
  try {
    const newsCategory = NewsCategories[category];
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${newsCategory}&pageSize=${newsCount}&apiKey=${apiKey}`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    if (json.status === 'ok') {
      const news = [];

      for (let i = 0; i < json.articles.length; i++) {
        const item = json.articles[i];

        if (item.urlToImage != null) {
          const sourceUrl = item.source.name;

          if (hasSubdomain(sourceUrl)) {
            item.source.name = removeSubdomain(sourceUrl);
          }

          item.icon = `https://www.google.com/s2/favicons?domain=${item.url}`;
          news.push(item);
        }
      }

      return news;
    }

    console.error(json); // eslint-disable-line no-console
    return null;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }

  return null;
};

/**
 * Powered by newsapi.org
 */
