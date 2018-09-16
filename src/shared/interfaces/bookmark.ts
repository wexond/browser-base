export interface Bookmark {
  _id?: string;
  title?: string;
  url?: string;
  favicon?: string;
  parent?: string;
  order?: number;
  type?: 'folder' | 'item';
  inputVisible?: boolean;
}
