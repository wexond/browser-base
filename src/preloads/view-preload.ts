import { ipcRenderer, webFrame } from 'electron';

import AutoComplete from './models/auto-complete';
import { getTheme } from '~/utils/themes';

const tabId = ipcRenderer.sendSync('get-webcontents-id');
const arg = process.argv.find(x => x.startsWith('--window-id='));

export let windowId: number = null;

if (arg) {
  windowId = parseInt(arg.split('--window-id=')[1], 10);
}

const goBack = () => {
  ipcRenderer.send(`browserview-call-${windowId}`, {
    tabId,
    scope: 'webContents.goBack',
  });
};

const goForward = () => {
  ipcRenderer.send(`browserview-call-${windowId}`, {
    tabId,
    scope: 'webContents.goForward',
  });
};

window.addEventListener('mouseup', e => {
  if (e.button === 3) {
    e.preventDefault();
    goBack();
  } else if (e.button === 4) {
    e.preventDefault();
    goForward();
  }
});

let beginningScrollLeft: number = null;
let beginningScrollRight: number = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x: number, y: number) {
  let left = 0;
  let right = 0;

  let n = document.elementFromPoint(x, y);

  while (n) {
    if (n.scrollLeft !== undefined) {
      left = Math.max(left, n.scrollLeft);
      right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft);
    }
    n = n.parentElement;
  }
  return { left, right };
}

document.addEventListener('wheel', e => {
  verticalMouseMove += e.deltaY;
  horizontalMouseMove += e.deltaX;

  if (beginningScrollLeft === null || beginningScrollRight === null) {
    const result = getScrollStartPoint(e.deltaX, e.deltaY);
    beginningScrollLeft = result.left;
    beginningScrollRight = result.right;
  }
});

ipcRenderer.on('scroll-touch-end', () => {
  if (
    horizontalMouseMove - beginningScrollRight > 150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollRight < 10) {
      goForward();
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      goBack();
    }
  }

  resetCounters();
});

window.addEventListener('load', AutoComplete.loadForms);
window.addEventListener('mousedown', AutoComplete.onWindowMouseDown);

const emitCallback = (msg: string, data: any) => {
  ipcRenderer.once(msg, (e, res) => {
    window.postMessage(
      {
        id: data.id,
        result: res,
        type: 'result',
      },
      '*',
    );
  });
};

if (
  window.location.protocol === 'wexond:' ||
  window.location.protocol === 'wexond-error:'
) {
  (async function() {
    const w = await webFrame.executeJavaScript('window');
    w.settings = ipcRenderer.sendSync('get-settings-sync');

    if (window.location.pathname.startsWith('//network-error')) {
      w.theme = getTheme(w.settings.theme);
      w.errorURL = await ipcRenderer.invoke(`get-error-url-${tabId}`);
    } else if (window.location.hostname.startsWith('history')) {
      w.getHistory = async () => {
        return await ipcRenderer.invoke(`history-get`);
      };
      w.removeHistory = (ids: string[]) => {
        ipcRenderer.send(`history-remove`, ids);
      };
    } else if (window.location.hostname.startsWith('newtab')) {
      w.getTopSites = async (count: number) => {
        return await ipcRenderer.invoke(`topsites-get`, count);
      };
    }
  })();
}

if (window.location.protocol === 'wexond:') {
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hostname === 'settings') document.title = 'Settings';
    else if (window.location.hostname === 'history') document.title = 'History';
    else if (window.location.hostname === 'bookmarks')
      document.title = 'Bookmarks';
    else if (window.location.hostname === 'extensions')
      document.title = 'Extensions';
    else if (window.location.hostname === 'newtab') {
      document.title = 'New tab';
    }
  });

  window.addEventListener('message', ({ data }) => {
    if (data.type === 'storage') {
      ipcRenderer.send(`storage-${data.operation}`, data.id, {
        scope: data.scope,
        ...data.data,
      });

      emitCallback(data.id, data);
    } else if (data.type === 'credentials-get-password') {
      ipcRenderer.send('credentials-get-password', data.id, data.data);
      emitCallback(data.id, data);
    } else if (data.type === 'save-settings') {
      ipcRenderer.send('save-settings', { settings: data.data });
    }
  });

  ipcRenderer.on('credentials-insert', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-insert',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-update', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-update',
        data,
      },
      '*',
    );
  });

  ipcRenderer.on('credentials-remove', (e, data) => {
    window.postMessage(
      {
        type: 'credentials-remove',
        data,
      },
      '*',
    );
  });
}
