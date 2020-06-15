import DbService from './db';
import {
  IVisitsDetails,
  IVisitItem,
  IHistorySearchDetails,
} from '~/interfaces';
import { IHistoryDbVisitsItem, IHistoryDbItem } from '../interfaces';
import {
  convertFromChromeTime,
  convertToChromeTime,
  dateToChromeTime,
} from '~/common/utils/date';
import {
  IHistoryItem,
  IHistoryAddDetails,
  IHistoryDeleteDetails,
  IHistoryDeleteRange,
  IHistoryVisitsRemoved,
  PageTransition,
} from '~/interfaces/history';
import { getYesterdayTime } from '../utils';
import { HistoryServiceBase } from '~/common/services/history';
import { HandlerFactory } from '../handler-factory';

const ITEM_SELECT =
  'SELECT id, last_visit_time, title, typed_count, url, visit_count FROM urls';

const VISITS_ITEM_SELECT =
  'SELECT id, url, from_visit, visit_time, transition FROM visits';

class HistoryService extends HistoryServiceBase {
  constructor() {
    super();

    const handler = HandlerFactory.createInvoker('history', this);

    handler('search', this.search);
    handler('getVisits', this.getVisits);
    handler('addUrl', this.addUrl);
    handler('addCustomUrl', this.addCustomUrl);
    handler('deleteUrl', this.deleteUrl);
    handler('deleteRange', this.deleteRange);
    handler('deleteAll', this.deleteAll);

    HandlerFactory.createReceiver('history', this, ['visitRemoved']);
  }

  private get db() {
    return DbService.history;
  }

  private stripQualifier(type: PageTransition) {
    return type & ~PageTransition.PAGE_TRANSITION_QUALIFIER_MASK;
  }

  private getQualifier(type: PageTransition) {
    return type & PageTransition.PAGE_TRANSITION_QUALIFIER_MASK;
  }

  private getPageTransition(type: PageTransition) {
    return (
      type |
      PageTransition.PAGE_TRANSITION_CHAIN_START |
      PageTransition.PAGE_TRANSITION_CHAIN_END
    );
  }

  private getPageTransitionString(type: PageTransition) {
    const t = this.stripQualifier(type);

    switch (t) {
      case PageTransition.PAGE_TRANSITION_LINK:
        return 'link';
      case PageTransition.PAGE_TRANSITION_TYPED:
        return 'typed';
      case PageTransition.PAGE_TRANSITION_AUTO_BOOKMARK:
        return 'auto_bookmark';
      case PageTransition.PAGE_TRANSITION_AUTO_SUBFRAME:
        return 'auto_subframe';
      case PageTransition.PAGE_TRANSITION_MANUAL_SUBFRAME:
        return 'manual_subframe';
      case PageTransition.PAGE_TRANSITION_GENERATED:
        return 'generated';
      case PageTransition.PAGE_TRANSITION_AUTO_TOPLEVEL:
        return 'auto_toplevel';
      case PageTransition.PAGE_TRANSITION_FORM_SUBMIT:
        return 'form_submit';
      case PageTransition.PAGE_TRANSITION_RELOAD:
        return 'reload';
      case PageTransition.PAGE_TRANSITION_KEYWORD:
        return 'keyword';
      case PageTransition.PAGE_TRANSITION_KEYWORD_GENERATED:
        return 'keyword_generated';
    }

    return null;
  }

  private formatItem = ({
    id,
    last_visit_time,
    title,
    typed_count,
    url,
    visit_count,
  }: IHistoryDbItem): IHistoryItem => {
    return {
      id: id.toString(),
      lastVisitTime: convertFromChromeTime(last_visit_time),
      title,
      typedCount: typed_count,
      url,
      visitCount: visit_count,
    };
  };

  private formatVisitItem = ({
    id,
    url,
    from_visit,
    visit_time,
    transition,
  }: IHistoryDbVisitsItem): IVisitItem => {
    return {
      id: url.toString(),
      visitId: id.toString(),
      referringVisitId: from_visit.toString(),
      visitTime: convertFromChromeTime(visit_time),
      transition: this.getPageTransitionString(transition),
    };
  };

  private getUrlData(url: string, select = '*') {
    return this.db
      .prepare(`SELECT ${select} FROM urls WHERE url = ? LIMIT 1`)
      .get(url);
  }

  public search({
    text,
    maxResults,
    startTime,
    endTime,
  }: IHistorySearchDetails): IHistoryItem[] {
    const limit = maxResults ?? 100;
    const start = convertToChromeTime(startTime ?? getYesterdayTime());
    const end = convertToChromeTime(endTime);

    let query = `${ITEM_SELECT} WHERE hidden = 0 `;

    let dateQuery = 'AND (last_visit_time >= @start ';

    if (endTime) {
      dateQuery += 'AND last_visit_time <= @end';
    }

    query += dateQuery + ') ';

    if (text) {
      query += `AND (url LIKE @text OR title LIKE @text)`;
    }

    return this.db
      .prepare(`${query} ORDER BY last_visit_time DESC LIMIT @limit`)
      .all({
        text: text != null ? `%${text}%` : null,
        limit,
        start,
        end,
      })
      .map(this.formatItem);
  }

  public getVisits({ url }: IVisitsDetails): IVisitItem[] {
    const id = this.getUrlData(url, 'id')?.id;

    if (!id) return [];

    return this.db
      .prepare(`${VISITS_ITEM_SELECT} WHERE url = ? ORDER BY visit_time ASC`)
      .all(id)
      .map(this.formatVisitItem);
  }

  public addCustomUrl(url: string, type = PageTransition.PAGE_TRANSITION_LINK) {
    const transition = this.getPageTransition(type);

    let item = this.getUrlData(url, 'id, visit_count');

    const time = dateToChromeTime(new Date());

    if (item) {
      this.db
        .prepare(`UPDATE urls SET visit_count = @visitCount WHERE id = @id`)
        .run({ id: item.id, visitCount: item.visit_count + 1 });
    } else {
      this.db
        .prepare(
          `INSERT INTO urls (url, visit_count, last_visit_time, title) VALUES (@url, @visitCount, @lastVisitTime, '')`,
        )
        .run({
          url,
          visitCount: 1,
          lastVisitTime: time,
        });

      item = this.getUrlData(url, 'id');
    }

    this.db
      .prepare(
        'INSERT INTO visits (url, visit_time, transition, from_visit, segment_id) VALUES (@url, @visitTime, @transition, 0, 0)',
      )
      .run({ url: item.id, visitTime: time, transition });
  }

  public addUrl({ url }: IHistoryAddDetails) {
    this.addCustomUrl(url, PageTransition.PAGE_TRANSITION_LINK);
  }

  public deleteUrl({ url }: IHistoryDeleteDetails) {
    const { id } = this.getUrlData(url, 'id');

    this.db.prepare('DELETE FROM urls WHERE id = @id').run({ id });
    this.db.prepare('DELETE FROM visits WHERE url = @url').run({ url: id });

    this.emit('visitRemoved', {
      allHistory: false,
      urls: [url],
    } as IHistoryVisitsRemoved);
  }

  public deleteRange({ startTime, endTime }: IHistoryDeleteRange) {
    const start = convertToChromeTime(startTime);
    const end = convertToChromeTime(endTime);

    const range = { start, end };

    const pages = this.db
      .prepare(
        `SELECT id, url FROM urls WHERE (last_visit_time >= @start AND last_visit_time <= @end)`,
      )
      .all(range);

    const visitQuery = this.db.prepare(
      `SELECT visit_time FROM visits WHERE url = @url`,
    );

    const removeUrl = this.db.prepare('DELETE FROM urls where id = @id');
    const removeVisit = this.db.prepare('DELETE FROM visits where url = @url');

    const urls: string[] = [];

    const count = this.db.transaction((pages: any[]) => {
      pages.forEach(({ id, url }) => {
        const visits: IVisitItem[] = visitQuery.all({ url: id });

        const inRange =
          visits.find((r) => r.visitTime < start || r.visitTime > end) == null;

        if (inRange) {
          urls.push(url);

          removeVisit.run({ url: id });
          removeUrl.run({ id });
        }
      });
    });

    count(pages);

    this.emit('visitRemoved', {
      allHistory: false,
      urls,
    } as IHistoryVisitsRemoved);
  }

  public deleteAll() {
    const urls: string[] = this.db
      .prepare('SELECT url FROM urls')
      .all()
      .map((r) => r.url);

    this.db.prepare('DELETE FROM urls').run();
    this.db.prepare('DELETE FROM visits').run();
    this.db.prepare('DELETE FROM visit_source').run();

    this.emit('visitRemoved', {
      allHistory: true,
      urls,
    } as IHistoryVisitsRemoved);
  }
}

export default new HistoryService();
