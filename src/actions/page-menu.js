import Store from '../store'

import { clipboard, dialog } from 'electron'
import { writeFile } from 'fs'

const getWebView = (app) => {
  return app.getSelectedPage().elements.webview
}

export default class PageMenuActions {
  static openLinkInNewTab (app) {
    app.elements.tabs.addTab({
      select: false,
      url: Store.pageMenuData.linkURL
    })
  }

  static copyLinkAddress () {
    clipboard.clear()
    clipboard.writeText(Store.pageMenuData.linkURL)
  }

  static saveLinkAs () {
    dialog.showSaveDialog(
      {
        defaultPath: 'link.html',
        filters: [
          {
            name: '*.html',
            extensions: ['html']
          }
        ]
      },
      function (path1) {
        let request = new XMLHttpRequest()
        request.open('GET', Store.pageMenuData.linkURL, true)
        request.send(null)
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            writeFile(path1, request.responseText, (err) => {
              if (err) console.error(err)
            })
          }
        }
      }
    )
  }

  static copyImage () {
    let img = nativeImage.createFromDataURL(Store.pageMenuData.srcURL)
    clipboard.clear()
    clipboard.writeImage(img)
  }

  static copyImageAddress () {
    clipboard.clear()
    clipboard.writeText(Store.pageMenuData.srcURL)
  }

  static print (app) {
    getWebView(app).print()
  }

  static saveAs (app) {
    dialog.showSaveDialog(
      {
        defaultPath: getWebView(app).getTitle() + '.html',
        filters: [
          {
            name: 'Webpage, complete',
            extensions: ['html']
          }
        ]
      },
      function (path1) {
        getWebView(app).getWebContents().savePage(path1, 'HTMLComplete', (error) => {
          if (error) console.error(error)
        })
      }
    )
  }

  static viewSource (app) {
    const url = getWebView(app).getURL()
    app.elements.tabs.addTab({
      select: true,
      url: 'view-source:' + url
    })
  }

  static inspectElement (app) {
    let data = Store.pageMenuData
    getWebView(app).inspectElement(data.x, data.y)
  }
}