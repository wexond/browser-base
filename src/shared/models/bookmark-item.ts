export default interface BookmarkItem {
  id: number;
  title?: string;
  url?: string;
  favicon?: string;
  parent: number;
  type: string;
} // eslint-disable-line
