import { HandlerFactory } from '../handler-factory';
import { EventHandler } from '../event-handler';
import { BookmarksService } from '../../services/bookmarks';

export class BookmarksAPI extends EventHandler {
  private service: BookmarksService;

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

  public start(service: BookmarksService) {
    this.service = service;

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

    this.handleEvents(this.service, {
      created: 'onCreated',
      removed: 'onRemoved',
      changed: 'onChanged',
      moved: 'onMoved',
    });
  }

  public get = (e, { idOrIdList }) => this.service.get(idOrIdList);

  public getChildren = (e, { id }) => this.service.getChildren(id);

  public getRecent = (e, { numberOfItems }) =>
    this.service.getRecent(numberOfItems);

  public getTree = () => this.service.getTree();

  public getSubTree = (e, { id }) => this.service.getSubTree(id);

  public search = (e, { query }) => this.service.search(query);

  public create = (e, { bookmark }) => this.service.create(bookmark);

  public move = (e, { id, destination }) => this.service.move(id, destination);

  public update = (e, { id, changes }) => this.service.update(id, changes);

  public remove = (e, { id }) => this.service.remove(id);

  public removeTree = (e, { id }) => this.service.removeTree(id);
}
