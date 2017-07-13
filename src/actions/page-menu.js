import Store from '../store'

import { clipboard, remote } from 'electron'
import { writeFile } from 'fs'
import { defaults } from 'request'
import { basename, extname } from 'path'
const { dialog } = remote

const getWebView = (app) => {
  return app.getSelectedPage().elements.webview
}

export const openLinkInNewTab = (app) => {
  app.elements.tabs.addTab({
    select: false,
    url: Store.pageMenuData.linkURL
  })
}

export const copyLinkAddress = () => {
  clipboard.clear()
  clipboard.writeText(Store.pageMenuData.linkURL)
}

export const saveLinkAs = () => {
  dialog.showSaveDialog({
    defaultPath: 'link.html',
    filters: [
      {
        name: '*.html',
        extensions: ['html']
      }
    ]
  }, (path) => {
    const request = new XMLHttpRequest()

    request.open('GET', Store.pageMenuData.linkURL, true)
    request.send(null)

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        writeFile(path, request.responseText, (err) => {
          if (err) console.error(err)
        })
      }
    }
  })
}

export const openImageInNewTab = (app) => {
  app.elements.tabs.addTab({
    select: false,
    url: Store.pageMenuData.srcURL
  })
}

export const saveImageAs = () => {
  const srcURL = Store.pageMenuData.srcURL
  const name = basename(srcURL)
  const extension = extname(name)

  let request = require('request').defaults({ encoding: null })
  console.log(request)

  request.get(srcURL, function (err, res, body) {
    dialog.showSaveDialog({
      defaultPath: 'image.' + extension,
      filters: [
        {
          name: '',
          extensions: [extension]
        }
      ]
    }, (path) => {
      writeFile(path, body, (err) => {
        if (err) console.error(err)
      })
    })
  })
}

export const copyImage = () => {
  let img = nativeImage.createFromDataURL(Store.pageMenuData.srcURL)
  clipboard.clear()
  clipboard.writeImage(img)
}

export const copyImageAddress = () => {
  clipboard.clear()
  clipboard.writeText(Store.pageMenuData.srcURL)
}

export const print = (app) => {
  getWebView(app).print()
}

export const saveAs = (app) => {
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

export const viewSource = (app) => {
  const url = getWebView(app).getURL()
  app.elements.tabs.addTab({
    select: true,
    url: 'view-source:' + url
  })
}

export const inspectElement = (app) => {
  let data = Store.pageMenuData
  getWebView(app).inspectElement(data.x, data.y)
}
