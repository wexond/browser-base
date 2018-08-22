import { observable } from 'mobx';
import { NewsCategories } from '~/enums';
import { NEWS_API_KEY } from '~/constants';
import { requestURL, hasSubdomain, removeSubdomain } from '~/utils';
import { NewsArticle } from '~/interfaces';

export class NewsStore {
  @observable
  public columns: any[][] = [];

  @observable
  public news: NewsArticle[] = [];

  public getColumns(columnsCount: number) {
    const columns = [];
    const itemsPerCol = Math.floor(this.news.length / columnsCount);

    for (let i = 0; i < columnsCount; i++) {
      if (i < columnsCount) {
        if (i === 0) {
          columns.push(
            this.news.slice(i * itemsPerCol, itemsPerCol * (i + 1) - 1),
          );
        } else if (i === 1) {
          columns.push(
            this.news.slice(i * (itemsPerCol - 1), itemsPerCol * (i + 1)),
          );
        } else {
          columns.push(this.news.slice(i * itemsPerCol, itemsPerCol * (i + 1)));
        }
      } else {
        columns.push(this.news.slice(i * itemsPerCol, this.news.length));
      }
    }

    return columns;
  }

  public getNews = async (
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
        const news: NewsArticle[] = [];

        for (let i = 0; i < json.articles.length; i++) {
          const item = json.articles[i];

          if (item.urlToImage != null) {
            if (hasSubdomain(item.source.name)) {
              item.source.name = removeSubdomain(item.source.name);
            }

            item.icon = `https://www.google.com/s2/favicons?domain=${item.url}`;
            news.push(item);
          }
        }

        return news;
      }

      console.error(json);
    } catch (e) {
      console.error(e);
    }

    return [];
  };
}
