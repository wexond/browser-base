export interface IBookmarksDocument {
  checksum: string;
  roots: IBookmarksDocumentRoots;
  sync_metadata: string;
  version: number;
}

export interface IBookmarksDocumentRoots {
  bookmark_bar: IBookmarksDocumentNode;
  other: IBookmarksDocumentNode;
  synced: IBookmarksDocumentNode;
}

export interface IBookmarksDocumentNode {
  id?: string;
  name?: string;
  type?: IBookmarksDocumentRootType;
  date_added?: string;
  show_icon?: boolean;
  url?: string;
  date_modified?: string;
  source?: string;
  guid?: string;
  meta_info?: IBookmarksDocumentRootMetaInfo;
  children?: IBookmarksDocumentRoot[];
  index?: number;
  parentId?: string;
}

export type IBookmarksDocumentRootType = 'folder' | 'url';

export type IBookmarksDocumentRootSource = 'unknown' | 'user_add' | 'sync';

export interface IBookmarksDocumentRootMetaInfo {
  last_visited: number;
  last_visited_desktop: number;
}
