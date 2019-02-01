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
