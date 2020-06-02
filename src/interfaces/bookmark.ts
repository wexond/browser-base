export interface IBookmark {
  _id?: string;
  title?: string;
  url?: string;
  favicon?: string;
  hovered?: boolean;
  isFolder?: boolean;
  parent?: string;
  order?: number;
  expanded?: boolean;
  static?: 'mobile' | 'main' | 'other' | 'pinned';
  children?: string[];
}

export interface IBookmarkNode {
  id?: string;
  parentId?: string;
  index?: number;
  url?: string;
  title?: string;
  dateAdded?: number;
  dateGroupModified?: number;
  unmodifiable?: BookmarkTreeNodeUnmodifiable;
  children?: IBookmarkNode[];
}

export enum BookmarkTreeNodeUnmodifiable {
  'managed',
}
