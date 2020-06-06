import { parentPort } from 'worker_threads';

import { IStorageMessage } from '~/interfaces';
import BookmarkService from '../services/bookmark';

export default () => {
  parentPort.on('message', (message: IStorageMessage) => {
    const type = message?.type;

    console.log(type);

    if (type === 'bookmarks-get-children') {
      const res = BookmarkService.move('358', {
        /* index: 0*/
        /*, parentId: '167'*/
        //,
        // parentId: '167',
        index: 6,
      });
      // const res = BookmarkService.getTree();

      parentPort.postMessage(res);
    }
  });
};
