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
  private invoke = WorkerMessengerFactory.createInvoker(
    'bookmarks',
    Application.instance.storage.worker,
  );

  constructor() {
    super();
    extensions.bookmarks.start(this);
  }

  public get = (ids: string | string[]) =>
    this.invoke<IBookmarkNode[]>('get', ids);

  public getChildren = (id: string) =>
    this.invoke<IBookmarkNode[]>('getChildren', id);

  public getRecent = (numberOfItems: number) =>
    this.invoke<IBookmarkNode[]>('getRecent', numberOfItems);

  public getTree = () => this.invoke<IBookmarkNode[]>('getTree');

  public getSubTree = (id: string) =>
    this.invoke<IBookmarkNode[]>('getSubtree', id);

  public search = (query: string | IBookmarkSearchQuery) =>
    this.invoke<IBookmarkNode[]>('search', query);

  public create = (bookmark: IBookmarkCreateInfo) =>
    this.invoke<IBookmarkNode[]>('create', bookmark);

  public move = (id: string, destination: IBookmarkDestination) =>
    this.invoke<IBookmarkNode[]>('move', id, destination);

  public update = (id: string, changes: IBookmarkChanges) =>
    this.invoke<IBookmarkNode[]>('update', id, changes);

  public remove = (id: string) => this.invoke<IBookmarkNode[]>('remove', id);

  public removeTree = (id: string) =>
    this.invoke<IBookmarkNode[]>('removeTree', id);
}
