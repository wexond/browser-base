import { StorageInvokerFactory } from '../storage-factory';
import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkCreateInfo,
  IBookmarkDestination,
  IBookmarkChanges,
} from '~/interfaces';
import { BookmarksServiceBase } from '~/common/services/bookmarks';
import { extensions } from '../extensions';

export class BookmarksService extends BookmarksServiceBase {
  private invoker = StorageInvokerFactory.create('bookmarks');

  private constructor() {
    super();
    extensions.bookmarks.start(this);
  }

  public static start() {
    return new BookmarksService();
  }

  public get = (ids: string | string[]) =>
    this.invoker<IBookmarkNode[]>('get', ids);

  public getChildren = (id: string) =>
    this.invoker<IBookmarkNode[]>('get-children', id);

  public getRecent = (numberOfItems: number) =>
    this.invoker<IBookmarkNode[]>('get-recent', numberOfItems);

  public getTree = () => this.invoker<IBookmarkNode[]>('get-tree');

  public getSubTree = (id: string) =>
    this.invoker<IBookmarkNode[]>('get-subtree', id);

  public search = (query: string | IBookmarkSearchQuery) =>
    this.invoker<IBookmarkNode[]>('search', query);

  public create = (bookmark: IBookmarkCreateInfo) =>
    this.invoker<IBookmarkNode[]>('create', bookmark);

  public move = (id: string, destination: IBookmarkDestination) =>
    this.invoker<IBookmarkNode[]>('move', id, destination);

  public update = (id: string, changes: IBookmarkChanges) =>
    this.invoker<IBookmarkNode[]>('update', id, changes);

  public remove = (id: string) => this.invoker<IBookmarkNode[]>('remove', id);

  public removeTree = (id: string) =>
    this.invoker<IBookmarkNode[]>('remove-tree', id);
}
