import { requestURL } from '../../shared/utils/network';
import { NEWS_API_KEY } from '../../shared/constants';
import { Countries, NewsCategories } from '../../shared/enums';

export const getNews = async (
  country: Countries,
  category: NewsCategories = NewsCategories.General,
  newsCount: number = 20,
  onlyWithThumbnail: boolean = true,
  apiKey: string = NEWS_API_KEY,
) => {
  try {
    const langCode = Countries[country];
    const newsCategory = NewsCategories[category];
    const url = `https://newsapi.org/v2/top-headlines?country=${langCode}&category=${newsCategory}&pageSize=${newsCount}&apiKey=${apiKey}`;

    const data = await requestURL(url);
    const json = JSON.parse(data);

    if (json.status === 'ok') {
      const news = [];

      return json;
    }

    console.log(json); // eslint-disable-line no-console
    return null;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }

  return null;
};

/**
 * Powered by newsapi.org
 */
