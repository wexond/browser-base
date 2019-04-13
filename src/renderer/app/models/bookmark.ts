export interface Bookmark {
  _id?: string;
  title?: string;
  url?: string;
  favicon?: string;
  hovered?: boolean;
  type?: 'item' | 'folder';
  parent?: string;
}
