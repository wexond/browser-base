import { EventEmitter } from 'events';

import {
  IBookmarkNode,
  IBookmarkRemoveInfo,
  IBookmarkChangeInfo,
  IBookmarkMoveInfo,
} from '~/interfaces/bookmark';

export declare interface BookmarksServiceBase {
  on(
    event: 'created',
    listener: (id?: string, node?: IBookmarkNode) => void,
  ): this;
  on(
    event: 'removed',
    listener: (id?: string, removeInfo?: IBookmarkRemoveInfo) => void,
  ): this;
  on(
    event: 'changed',
    listener: (id?: string, changeInfo?: IBookmarkChangeInfo) => void,
  ): this;
  on(
    event: 'moved',
    listener: (id?: string, moveInfo?: IBookmarkMoveInfo) => void,
  ): this;
}

export class BookmarksServiceBase extends EventEmitter {}
