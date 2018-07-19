import PageModel from './page';

export default class FolderModel {
  public root: boolean = false;

  public title: string;

  public folders: FolderModel[] = [];

  public items: PageModel[] = [];

  constructor(
    title: string = '',
    items: PageModel[] = [],
    folders: FolderModel[] = [],
    root: boolean = false,
  ) {
    this.title = title;
    this.items = items;
    this.folders = folders;
    this.root = root;
  }
}
