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

export interface IBookmarkSearchQuery {
  url?: string;
  title?: string;
}

export interface IBookmarkChanges {
  url?: string;
  title?: string;
}

export interface IBookmarkDestination {
  parentId?: string;
  index?: number;
}

export interface IBookmarkCreateInfo {
  parentId?: string;
  index?: number;
  title?: string;
  url?: string;
}

export interface IBookmarkRemoveInfo {
  parentId: string;
  index: number;
  node: IBookmarkNode;
}

export interface IBookmarkChangeInfo {
  title: string;
  url: string;
}

export interface IBookmarkMoveInfo {
  parentId: string;
  index: number;
  oldParentId: string;
  oldIndex: number;
}
