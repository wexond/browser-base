import { ipcRenderer, remote, webFrame } from 'electron';

import AutoComplete from './models/auto-complete';

const tabId = remote.getCurrentWebContents().id;
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

if (window.location.protocol === 'wexond:') {
  webFrame.executeJavaScript('window', false, (w: any) => {
    w.settings = ipcRenderer.sendSync('get-settings-sync');
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
