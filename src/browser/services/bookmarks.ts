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
import { Worker } from 'worker_threads';

export class BookmarksService extends BookmarksServiceBase {
  private invoker = WorkerMessengerFactory.createInvoker('bookmarks');

  constructor(worker: Worker) {
    super();
    this.invoker.initialize(worker);
    extensions.bookmarks.start(this);
  }

  public get = (ids: string | string[]) =>
    this.invoker.invoke<IBookmarkNode[]>('get', ids);

  public getChildren = (id: string) =>
    this.invoker.invoke<IBookmarkNode[]>('getChildren', id);

  public getRecent = (numberOfItems: number) =>
    this.invoker.invoke<IBookmarkNode[]>('getRecent', numberOfItems);

  public getTree = () => this.invoker.invoke<IBookmarkNode[]>('getTree');

  public getSubTree = (id: string) =>
    this.invoker.invoke<IBookmarkNode[]>('getSubtree', id);

  public search = (query: string | IBookmarkSearchQuery) =>
    this.invoker.invoke<IBookmarkNode[]>('search', query);

  public create = (bookmark: IBookmarkCreateInfo) =>
    this.invoker.invoke<IBookmarkNode[]>('create', bookmark);

  public move = (id: string, destination: IBookmarkDestination) =>
    this.invoker.invoke<IBookmarkNode[]>('move', id, destination);

  public update = (id: string, changes: IBookmarkChanges) =>
    this.invoker.invoke<IBookmarkNode[]>('update', id, changes);

  public remove = (id: string) =>
    this.invoker.invoke<IBookmarkNode[]>('remove', id);

  public removeTree = (id: string) =>
    this.invoker.invoke<IBookmarkNode[]>('removeTree', id);
}
