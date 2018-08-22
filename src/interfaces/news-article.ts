export interface NewsArticle {
  title?: string;
  description?: string;
  publishedAt?: Date;
  url?: string;
  urlToImage?: string;
  icon?: string;
  source?: {
    id?: string;
    name?: string;
  };
}
