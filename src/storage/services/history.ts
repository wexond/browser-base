import DbService from './db';
import {
  IVisitsDetails,
  IVisitItem,
  IHistorySearchDetails,
} from '~/interfaces';
import {
  IHistoryDbVisitsItem,
  IHistoryDbItem,
  PageTransition,
} from '../interfaces';
import {
  convertFromChromeTime,
  convertToChromeTime,
} from '~/common/utils/date';
import { IHistoryItem, IHistoryAddDetails } from '~/interfaces/history';
import { getYesterdayTime } from '../utils';

const TRANSITIONS = [
  'link',
  'typed',
  'auto_bookmark',
  'auto_subframe',
  'manual_subframe',
  'generated',
  'auto_toplevel',
  'form_submit',
  'reload',
  'keyword',
  'keyword_generated',
];

const ITEM_SELECT =
  'SELECT id, last_visit_time, title, typed_count, url, visit_count FROM urls';

const VISITS_ITEM_SELECT =
  'SELECT id, url, from_visit, visit_time, transition FROM visits';

class HistoryService {
  private get db() {
    return DbService.history;
  }

  private stripQualifier(type: number) {
    return TRANSITIONS[type & ~PageTransition.QUALIFIER_MASK];
  }

  private getQualifier(type: number) {
    return type & PageTransition.QUALIFIER_MASK;
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
      transition: this.stripQualifier(transition),
    };
  };

  public getUrlId(url: string): string {
    return this.db.prepare('SELECT id FROM urls WHERE url = ? LIMIT 1').get(url)
      ?.id;
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

    let query = `${ITEM_SELECT} WHERE `;

    let dateQuery = '(last_visit_time >= @start ';

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
    const urlId = this.getUrlId(url);

    if (!urlId) return [];

    return this.db
      .prepare(`${VISITS_ITEM_SELECT} WHERE url = ? ORDER BY visit_time ASC`)
      .all(urlId)
      .map(this.formatVisitItem);
  }

  // public addUrl({url}: IHistoryAddDetails)  {

  // }
}

export default new HistoryService();
