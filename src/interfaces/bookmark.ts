export interface Bookmark {
  _id?: string;
  title?: string;
  url?: string;
  favicon?: string;
  parent?: string;
  type?: 'folder' | 'item';
  hovered?: boolean;
  inputVisible?: boolean;
}
