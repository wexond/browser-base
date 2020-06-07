import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { StorageService } from '~/browser/services/storage';

export class BookmarksAPI extends EventHandler {
  private get bookmarksService() {
    return StorageService.instance.bookmarks;
  }

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
  }

  public start() {
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

    this.handleEvents(this.bookmarksService, {
      created: 'onCreated',
      removed: 'onRemoved',
      changed: 'onChanged',
      moved: 'onMoved',
    });
  }

  public get = (e, { idOrIdList }) => this.bookmarksService.get(idOrIdList);

  public getChildren = (e, { id }) => this.bookmarksService.getChildren(id);

  public getRecent = (e, { numberOfItems }) =>
    this.bookmarksService.getRecent(numberOfItems);

  public getTree = () => this.bookmarksService.getTree();

  public getSubTree = (e, { id }) => this.bookmarksService.getSubTree(id);

  public search = (e, { query }) => this.bookmarksService.search(query);

  public create = (e, { bookmark }) => this.bookmarksService.create(bookmark);

  public move = (e, { id, destination }) =>
    this.bookmarksService.move(id, destination);

  public update = (e, { id, changes }) =>
    this.bookmarksService.update(id, changes);

  public remove = (e, { id }) => this.bookmarksService.remove(id);

  public removeTree = (e, { id }) => this.bookmarksService.removeTree(id);
}
