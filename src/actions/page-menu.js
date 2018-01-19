import Store from '../stores/store'

import { clipboard, remote, nativeImage } from 'electron'
import { writeFile } from 'fs'
import { defaults } from 'request'
import { basename, extname } from 'path'
const { dialog } = remote

import * as tabsActions from '../actions/tabs'
import * as pagesActions from '../actions/pages'

export const openLinkInNewTab = () => {
  tabsActions.addTab({
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

export const openImageInNewTab = () => {
  tabsActions.addTab({
    select: false,
    url: Store.pageMenuData.srcURL
  })
}

export const saveImageAs = () => {
  const srcURL = Store.pageMenuData.srcURL
  const name = basename(srcURL)
  const extension = extname(name)

  let request = require('request').defaults({ encoding: null })

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

export const print = () => {
  pagesActions.getSelectedPage().page.webview.print()
}

export const saveAs = () => {
  dialog.showSaveDialog(
    {
      defaultPath: pagesActions.getSelectedPage().page.webview.getTitle() + '.html',
      filters: [
        {
          name: 'Webpage, complete',
          extensions: ['html']
        }
      ]
    },
    function (path1) {
      pagesActions.getSelectedPage().page.webview.getWebContents().savePage(path1, 'HTMLComplete', (error) => {
        if (error) console.error(error)
      })
    }
  )
}

export const viewSource = () => {
  const url = pagesActions.getSelectedPage().page.webview.getURL()
  tabsActions.addTab({
    select: true,
    url: 'view-source:' + url
  })
}

export const inspectElement = () => {
  let data = Store.pageMenuData
  pagesActions.getSelectedPage().page.webview.inspectElement(data.x, data.y)
}
