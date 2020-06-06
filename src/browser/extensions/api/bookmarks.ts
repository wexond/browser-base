import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { StorageFactory } from '~/browser/storage-factory';
import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkCreateInfo,
  IBookmarkDestination,
  IBookmarkChanges,
} from '~/interfaces';

export class BookmarksAPI {
  private storageHandler = StorageFactory.create('bookmarks');

  constructor() {
    const handler = HandlerFactory.create('bookmarks', this);

    handler('get', this.get);
    handler('getChildren', this.getChildren);
    handler('getRecent', this.getRecent);
    handler('getTree', this.getTree);
    handler('getSubTree', this.getSubTree);
    handler('search', this.search);
    handler('create', this.create);
    handler('move', this.move);
    handler('update', this.update);
    handler('remove', this.remove);
    handler('removeTree', this.removeTree);
  }

  public get(e, { idOrIdList }: { idOrIdList: string | string[] }) {
    return this.storageHandler<IBookmarkNode[]>('get', idOrIdList);
  }

  public getChildren(e, { id }: { id: string }) {
    return this.storageHandler<IBookmarkNode[]>('get-children', id);
  }

  public getRecent(e, { numberOfItems }: { numberOfItems: number }) {
    return this.storageHandler<IBookmarkNode[]>('get-recent', numberOfItems);
  }

  public getTree() {
    return this.storageHandler<IBookmarkNode[]>('get-tree');
  }

  public getSubTree(e, { id }: { id: string }) {
    return this.storageHandler<IBookmarkNode[]>('get-subtree', id);
  }

  public search(e, { query }: { query: string | IBookmarkSearchQuery }) {
    return this.storageHandler<IBookmarkNode[]>('search', query);
  }

  public create(e, { bookmark }: { bookmark: IBookmarkCreateInfo }) {
    return this.storageHandler<IBookmarkNode>('create', bookmark);
  }

  public move(
    e,
    { id, destination }: { id: string; destination: IBookmarkDestination },
  ) {
    return this.storageHandler<IBookmarkNode>('move', id, destination);
  }

  public update(e, { id, changes }: { id: string; changes: IBookmarkChanges }) {
    return this.storageHandler<IBookmarkNode>('update', id, changes);
  }

  public remove(e, { id }: { id: string }) {
    return this.storageHandler('remove', id);
  }

  public removeTree(e, { id }: { id: string }) {
    return this.storageHandler('remove-tree', id);
  }
}
