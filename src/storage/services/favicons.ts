import DbService from './db';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';

class FaviconsService {
  constructor() {
    const handler = WorkerMessengerFactory.createHandler('favicons', this);

    handler('getFaviconUrl', this.getFaviconUrl);
    handler('getFavicon', this.getFavicon);
  }

  private get db() {
    return DbService.favicons;
  }

  private getIconId(pageUrl: string): number {
    const { icon_id } = this.db
      .prepare(
        'SELECT icon_id FROM icon_mappping WHERE page_url = @pageUrl LIMIT 1',
      )
      .get({ pageUrl });

    return icon_id;
  }

  public getFaviconUrl(pageUrl: string): string {
    const id = this.getIconId(pageUrl);

    const { url } = this.db
      .prepare('SELECT url FROM favicons WHERE id = @id')
      .get({ id });

    return url;
  }

  public getFavicon(url: string) {
    const { id } = this.db
      .prepare('SELECT id FROM favicons WHERE url = @url')
      .get({ url });

    const { last_updated, image_data, width, height } = this.db
      .prepare(
        'SELECT last_updated, image_data, widht, height FROM favicon_bitmaps WHERE id = @id',
      )
      .get({ id });

    console.log(width, height);
  }
}

export default new FaviconsService();
