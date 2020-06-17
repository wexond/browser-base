import DbService from './db';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';

class FaviconsService {
  public start() {
    const handler = WorkerMessengerFactory.createHandler('favicons', this);

    handler('getFavicon', this.getFavicon);
  }

  private get db() {
    return DbService.favicons;
  }

  public getFavicon(pageUrl: string) {
    const data = this.db
      .prepare(
        `
      SELECT image_data
      FROM favicon_bitmaps
      INNER JOIN icon_mapping
        ON favicon_bitmaps.icon_id=icon_mapping.icon_id
      WHERE icon_mapping.page_url=@pageUrl AND favicon_bitmaps.width = 32 LIMIT 1
      `,
      )
      .get({ pageUrl });

    return data?.image_data;
  }
}

export default new FaviconsService();
