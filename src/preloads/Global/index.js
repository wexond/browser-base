const {app, remote} = require('electron').remote
const {ipcRenderer} = require('electron')

document.addEventListener('click', function (e) {
  if (e.which === 1) {
    ipcRenderer.sendToHost('webview:mouse-left-button')
  }
})
