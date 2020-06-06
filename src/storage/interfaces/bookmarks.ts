export interface IBookmarksDocument {
  checksum?: string;
  roots: IBookmarksDocumentRoots;
  sync_metadata?: string;
  version: number;
}

export interface IBookmarksDocumentRoots {
  bookmark_bar?: IBookmarksDocumentNode;
  other?: IBookmarksDocumentNode;
  synced?: IBookmarksDocumentNode;
}

export interface IBookmarksDocumentNode {
  id?: string;
  name?: string;
  type?: IBookmarksDocumentNodeType;
  date_added?: string;
  show_icon?: boolean;
  url?: string;
  date_modified?: string;
  source?: IBookmarksDocumentNodeSource;
  guid?: string;
  meta_info?: IBookmarksDocumentNodeMetaInfo;
  children?: IBookmarksDocumentNode[];
  index?: number;
  parentId?: string;
}

export type IBookmarksDocumentNodeType = 'folder' | 'url';

export type IBookmarksDocumentNodeSource = 'unknown' | 'user_add' | 'sync';

export interface IBookmarksDocumentNodeMetaInfo {
  last_visited: number;
  last_visited_desktop: number;
}
