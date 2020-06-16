import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkCreateInfo,
  IBookmarkDestination,
  IBookmarkChanges,
} from '~/interfaces';
import { BookmarksServiceBase } from '~/common/services/bookmarks';
import { extensions } from '../extensions';
import { WorkerMessengerFactory } from '~/common/worker-messenger-factory';
import { Application } from '../application';

export class BookmarksService extends BookmarksServiceBase {
  private invoker = WorkerMessengerFactory.createInvoker(
    'bookmarks',
    Application.instance.storage.worker,
  );

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
    this.invoker<IBookmarkNode[]>('getChildren', id);

  public getRecent = (numberOfItems: number) =>
    this.invoker<IBookmarkNode[]>('getRecent', numberOfItems);

  public getTree = () => this.invoker<IBookmarkNode[]>('getTree');

  public getSubTree = (id: string) =>
    this.invoker<IBookmarkNode[]>('getSubtree', id);

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
    this.invoker<IBookmarkNode[]>('removeTree', id);
}
