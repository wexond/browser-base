const { ipcRenderer, remote } = require('electron');

const viewsMap = remote.getGlobal('viewsMap');
const browserViewId = remote.BrowserView.fromWebContents(
  remote.getCurrentWebContents(),
).id;

let tabId = viewsMap[browserViewId];

window.addEventListener('mouseup', e => {
  if (e.button === 3) {
    // Back button
    ipcRenderer.send('browserview-navigation-action', {
      id: tabId,
      action: 'back',
    });
  } else if (e.button === 4) {
    // Forward button
    ipcRenderer.send('browserview-navigation-action', {
      id: tabId,
      action: 'forward',
    });
  }
});

let beginningScrollLeft = null;
let beginningScrollRight = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x, y) {
  var left = 0;
  var right = 0;

  var n = document.elementFromPoint(x, y);
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
      ipcRenderer.send('browserview-navigation-action', {
        id: tabId,
        action: 'forward',
      });
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      ipcRenderer.send('browserview-navigation-action', {
        id: tabId,
        action: 'back',
      });
    }
  }

  resetCounters();
});
