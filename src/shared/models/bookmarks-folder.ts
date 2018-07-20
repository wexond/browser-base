export default interface BookmarksFolder {
  id?: number;
  title?: string;
  folders?: number[];
  items?: number[];
  root?: boolean;
} // eslint-disable-line
