import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { Extensions } from '..';

export class BookmarksAPI {
  constructor() {
    const handler = HandlerFactory.create('bookmarks', this);
  }
}
