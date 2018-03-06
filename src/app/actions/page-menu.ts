import Store from '../store'

import { clipboard, nativeImage, remote } from 'electron'
import { writeFile } from 'fs'
import { basename, extname } from 'path'
import { defaults } from 'request'
const { dialog } = remote

import * as pagesActions from '../actions/pages'
import * as tabsActions from '../actions/tabs'

export const openLinkInNewTab = (): void => {
  tabsActions.addTab({
    select: false, 
    url: Store.pageMenuData.linkURL
  })
}

export const copyLinkAddress = (): void => {
  clipboard.clear()
  clipboard.writeText(Store.pageMenuData.linkURL)
}

export const saveLinkAs = (): void => {
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
          if (err) { console.error(err) }
        })
      }
    }
  })
}

export const openImageInNewTab = (): void => {
  tabsActions.addTab({
    select: false,
    url: Store.pageMenuData.srcURL
  })
}

export const saveImageAs = (): void => {
  const srcURL = Store.pageMenuData.srcURL
  const name = basename(srcURL)
  const extension = extname(name)

  const request = require('request').defaults({ encoding: null })

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
        if (err) { console.error(err) }
      })
    })
  })
}

export const copyImage = (): void => {
  const img = nativeImage.createFromDataURL(Store.pageMenuData.srcURL)
  clipboard.clear()
  clipboard.writeImage(img)
}

export const copyImageAddress = (): void => {
  clipboard.clear()
  clipboard.writeText(Store.pageMenuData.srcURL)
}

export const print = (): void => {
  pagesActions.getSelectedPage().page.webview.print()
}

export const saveAs = (): void => {
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
      pagesActions.getSelectedPage().page.webview.getWebContents().savePage(path1, 'HTMLComplete', (error: Error) => {
        if (error) { console.error(error) }
      })
    }
  )
}

export const viewSource = (): void => {
  const url: string = pagesActions.getSelectedPage().page.webview.getURL()
  tabsActions.addTab({
    select: true,
    url: 'view-source:' + url
  })
}

export const inspectElement = (): void => {
  const data = Store.pageMenuData
  pagesActions.getSelectedPage().page.webview.inspectElement(data.x, data.y)
}
