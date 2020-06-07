import { parentPort } from 'worker_threads';

import { IStorageMessage, IStorageResponse } from '~/interfaces';
import BookmarksService from '../services/bookmarks';

const registry = {
  bookmarks: {
    instance: BookmarksService,
    methods: {
      get: BookmarksService.get,
      'get-children': BookmarksService.getChildren,
      'get-recent': BookmarksService.getRecent,
      'get-tree': BookmarksService.getTree,
      'get-subtree': BookmarksService.getSubTree,
      search: BookmarksService.search,
      create: BookmarksService.create,
      move: BookmarksService.move,
      update: BookmarksService.update,
      remove: BookmarksService.remove,
      'remove-tree': BookmarksService.removeTree,
    },
    events: ['created', 'removed', 'changed', 'moved'],
  },
};

const handleInvoker = async ({ id, scope, method, args }: IStorageMessage) => {
  const item = registry[scope];
  const fn = (item.methods as any)[method].bind(item.instance);

  if (!(args instanceof Array)) {
    args = [args];
  }

  if (fn) {
    let data: any;
    let error: Error;

    try {
      data = await fn(...args);
    } catch (err) {
      error = err;
      console.error(`Storage error (id: ${id}):`, error);
    }

    parentPort.postMessage({
      action: 'invoker',
      id,
      data,
      success: !error,
      error,
    } as IStorageResponse);
  }
};

export default () => {
  for (const scope in registry) {
    const item = registry[scope];
    const events = item.events as string[];

    events.forEach((r) => {
      item.instance.addListener(r, (...data: any[]) => {
        parentPort.postMessage({
          action: 'receiver',
          scope,
          eventName: r,
          data,
        } as IStorageResponse);
      });
    });
  }

  parentPort.on('message', handleInvoker);
};
