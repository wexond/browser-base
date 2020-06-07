import { HandlerFactory } from '../handler-factory';
import { StorageFactory } from '~/browser/storage-factory';
import {
  IBookmarkNode,
  IBookmarkSearchQuery,
  IBookmarkCreateInfo,
  IBookmarkDestination,
  IBookmarkChanges,
} from '~/interfaces';
import { EventHandler } from '../event-handler';

export class BookmarksAPI extends EventHandler {
  private invoker = StorageFactory.createInvoker('bookmarks');

  constructor() {
    super('bookmarks', [
      'onCreated',
      'onRemoved',
      'onChanged',
      'onMoved',
      'onChildrenReordered',
      'onImportBegan',
      'onImportEnded',
    ]);

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

    const receiver = StorageFactory.createReceiver('bookmarks');

    receiver('created', (data) => {
      console.log(data);
    });
  }

  public get(e, { idOrIdList }: { idOrIdList: string | string[] }) {
    return this.invoker<IBookmarkNode[]>('get', idOrIdList);
  }

  public getChildren(e, { id }: { id: string }) {
    return this.invoker<IBookmarkNode[]>('get-children', id);
  }

  public getRecent(e, { numberOfItems }: { numberOfItems: number }) {
    return this.invoker<IBookmarkNode[]>('get-recent', numberOfItems);
  }

  public getTree() {
    return this.invoker<IBookmarkNode[]>('get-tree');
  }

  public getSubTree(e, { id }: { id: string }) {
    return this.invoker<IBookmarkNode[]>('get-subtree', id);
  }

  public search(e, { query }: { query: string | IBookmarkSearchQuery }) {
    return this.invoker<IBookmarkNode[]>('search', query);
  }

  public create(e, { bookmark }: { bookmark: IBookmarkCreateInfo }) {
    return this.invoker<IBookmarkNode>('create', bookmark);
  }

  public move(
    e,
    { id, destination }: { id: string; destination: IBookmarkDestination },
  ) {
    return this.invoker<IBookmarkNode>('move', id, destination);
  }

  public update(e, { id, changes }: { id: string; changes: IBookmarkChanges }) {
    return this.invoker<IBookmarkNode>('update', id, changes);
  }

  public remove(e, { id }: { id: string }) {
    return this.invoker('remove', id);
  }

  public removeTree(e, { id }: { id: string }) {
    return this.invoker('remove-tree', id);
  }
}
