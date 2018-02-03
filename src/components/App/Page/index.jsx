import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

import { ipcRenderer } from 'electron'

import Storage from '../../../utils/storage'
import Colors from '../../../utils/colors'

import * as filesActions from '../../../actions/files'
import * as tabsActions from '../../../actions/tabs'
import * as webviewActions from '../../../actions/webview'

import ipcMessages from '../../../defaults/ipc-messages'
import extensionsDefaults from '../../../defaults/extensions'

import FindMenu from '../FindMenu'

@observer
export default class Page extends React.Component {
  componentDidMount = async () => {
    const tab = this.props.tab
    const page = this.props.page
    let lastURL = ''
    let favicon = ''

    filesActions.checkFiles()

    let historyId = -1
    let siteId = -1

    lastURL = ''

    page.page = this

    const updateData = async () => {
      if (lastURL === tab.url) {
        if (historyId !== -1) {
          const history = await Storage.get('history')
          const item = history.filter(item => { return item.id === historyId })[0]
          if (item != null) {
            item.url = tab.url
            item.favicon = tab.favicon
            item.title = tab.title
            item.ogData = tab.ogData
            Storage.save('history', history)
          }
        }
        if (siteId !== -1) {
          const sites = await Storage.get('sites')
          const item = sites.filter(item => { return item.id === siteId })[0]
          if (item != null) {
            item.url = tab.url
            item.favicon = tab.favicon
            item.title = tab.title
            Storage.save('sites', sites)
          }
        }
      }
    }

    const updateInfo = async (e) => {
      Store.app.refreshIconsState()

      if (e.url != null) {
        if (e.isMainFrame != null && !e.isMainFrame) return
        tab.url = e.url
        Store.url = e.url

        if (Store.selectedTab === tab.id) {
          Store.app.bar.addressBar.setInfo(e.url)
        }
        updateData()
      }

      if (e.type === 'did-stop-loading') {
        tab.loading = false
      }
    }

    const executeExtensionEvent = (name, eventObject) => {
      for (var i = Store.extensions.length; i--;) {
        Store.extensions[i].backgroundExtension.webview.send(ipcMessages.EXTENSION_EXECUTE_EVENT + name, eventObject)
      }
    }

    this.webview.addEventListener('did-stop-loading', updateInfo)
    this.webview.addEventListener('did-navigate', updateInfo)
    this.webview.addEventListener('did-navigate-in-page', updateInfo)
    this.webview.addEventListener('will-navigate', updateInfo)

    this.webview.addEventListener('load-commit', async (e) => {
      const eventObject = {
        url: e.url,
        isMainFrame: e.isMainFrame
      }

      executeExtensionEvent(extensionsDefaults.events.webNavigation.onCommited, eventObject)

      tab.loading = true
      if (e.url !== lastURL && e.isMainFrame) {
        lastURL = e.url
        filesActions.checkFiles()

        const regex = /(http(s?)):\/\/(www.)?/gi
        let url = tab.url
        if (url.indexOf('/', 9) !== -1) {
          url = url.substring(0, url.indexOf('/', 9))
        }

        historyId = await Storage.addHistoryItem(tab.title, e.url, favicon)
        siteId = await Storage.addSite(tab.title, url, favicon)
      }
    })

    this.webview.addEventListener('dom-ready', async (e) => {
      if (lastURL === tab.url) {
        const ogData = await webviewActions.getOGData(this.webview)
        tab.ogData = ogData
        updateData()
      }
    })

    const setBarBorder = async () => {
      const shadow = await webviewActions.getBarBorder(this.webview)

      Store.border = shadow
      tab.barBorder = shadow
    }

    this.webview.addEventListener('did-finish-load', async () => {
      setBarBorder()
    })

    this.webview.addEventListener('new-window', (e) => {
      if (e.disposition === 'new-window'
          || e.disposition === 'foreground-tab') {
        tabsActions.addTab({
          select: true,
          url: e.url
        })
      } else if (e.disposition === 'background-tab') {
        tabsActions.addTab({
          select: false,
          url: e.url
        })
      }
    })

    this.webview.addEventListener('enter-html-full-screen', (e) => {
      Store.isFullscreen = true
    })

    this.webview.addEventListener('leave-html-full-screen', (e) => {
      Store.isFullscreen = false
    })

    this.webview.addEventListener('page-favicon-updated', (e) => {
      let request = new XMLHttpRequest()
      request.onreadystatechange = async (event) => {
        if (request.readyState === 4) {
          if (request.status === 404) {
            tab.favicon = ''
            favicon = ''
          } else {
            Storage.addFavicon(e.favicons[0])
            tab.favicon = e.favicons[0]
            favicon = e.favicons[0]
          }
          updateData()
        }
      }

      request.open('GET', e.favicons[0], true)
      request.send(null)
    })

    this.webview.addEventListener('page-title-updated', async (e) => {
      tab.title = e.title
      updateData()
    })

    this.webview.addEventListener('did-change-theme-color', (e) => {
      let color = e.themeColor
      if (color == null) color = '#fff'

      Store.backgroundColor = color
      tab.backgroundColor = color
      Store.foreground = Colors.getForegroundColor(color)
      Colors.getForegroundColor(color)
    })

    // When webcontents of a webview are not available,
    // we can't use them, so we need to check if 
    // these webcontents are not null, 
    // and then use them.
    let checkWebcontentsInterval = setInterval(() => {
      // We need to use webcontents,
      // to add an event listener `context-menu`.
      if (this.webview.getWebContents() != null) {
        this.webview.getWebContents().on('context-menu', onContextMenu)

        // When these webcontents are finally not null,
        // just remove the interval.
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    const onContextMenu = (e, params) => {
      Store.app.pageMenu.setState((previousState) => {
         // 0  : Open link in new tab
         // 1  : -----------------------
         // 2  : Copy link address
         // 3  : Save link as
         // 4  : -----------------------
         // 5  : Open image in new tab
         // 6  : Save image as
         // 7  : Copy image
         // 8  : Copy image address
         // 9  : -----------------------
         // 10 : Save as
         // 11 : Print
         // 12 : -----------------------
         // 13 : View source
         // 14 : Inspect element
         
        let menuItems = previousState.items
        // Hide or show first 5 items.
        for (var i = 0; i < 5; i++) {
          menuItems[i].visible = params.linkURL !== ''
        }

        // Next 5 items.
        for (i = 5; i < 10; i++) {
          menuItems[i].visible = params.hasImageContents
        }

        // Next 4 items.
        for (i = 10; i < 14; i++) {
          menuItems[i].visible = !params.hasImageContents && params.linkURL === ''
        }

        return {
          items: menuItems
        }
      })

      Store.app.pageMenu.show()
      Store.pageMenuData = params

      // Calculate new menu position
      // using cursor x, y and 
      // width, height of the menu.
      let x = Store.cursor.x
      let y = Store.cursor.y

      // By default it opens menu from upper left corner.
      let left = x + 1
      let top = y + 1

      // Open menu from right corner.
      if (left + 300 > window.innerWidth) {
        left = x - 301
      }

      // Open menu from bottom corner.
      if (top + Store.app.pageMenu.newHeight > window.innerHeight) {
        top = y - Store.app.pageMenu.newHeight
      }

      if (top < 0) {
        top = 96
      }

      // Set the new position.
      Store.app.pageMenu.setState({left: left, top: top})
    }

    this.registerSwipeListener()
  }

  registerSwipeListener() {
    let trackingFingers = false
    let startTime = 0
    let isSwipeOnLeftEdge = false
    let isSwipeOnRightEdge = false
    let deltaX = 0
    let deltaY = 0
    let time

    ipcRenderer.on('scroll-touch-begin', () => {
      trackingFingers = true
      startTime = (new Date()).getTime()
    })

    this.webview.addEventListener('wheel', (e) => {
      if (trackingFingers) {
        deltaX = deltaX + e.deltaX
        deltaY = deltaY + e.deltaY
        time = (new Date()).getTime() - startTime
      }
    })

    ipcRenderer.on('scroll-touch-end', () => {
      const distanceThresholdX = 150
      const distanceThresholdY = 200
      const timeMax = 200
      const timeMin = 20
      if (trackingFingers && time > timeMin && time < timeMax && Math.abs(deltaY) < distanceThresholdY) {
        if (Math.abs(deltaX) / time > 3.5) {
          if (deltaX > distanceThresholdX) {
            this.goForward()
          } else if (deltaX < -distanceThresholdX) {
            this.goBack()
          }
        }
      }
      trackingFingers = false
      deltaX = 0
      deltaY = 0
      startTime = 0
    })

    ipcRenderer.on('scroll-touch-edge', () => {
      if (trackingFingers) {
        if (!isSwipeOnRightEdge && deltaX > 0) {
          isSwipeOnRightEdge = true
          isSwipeOnLeftEdge = false
          time = 0
          deltaX = 0
        } else if (!isSwipeOnLeftEdge && deltaX < 0) {
          isSwipeOnLeftEdge = true
          isSwipeOnRightEdge = false
          time = 0
          deltaX = 0
        }
      }
    })

  }

  goBack () {
    this.webview.goBack()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  goForward () {
    this.webview.goForward()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  refresh () {
    this.webview.reload()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  render () {
    const tab = this.props.tab
    const page = this.props.page
    const isSelected = Store.selectedTab === tab.id

    const {
      url
    } = this.props.page

    const pageClass = (isSelected) ? '' : 'hide'

    return (
      <div className={'page ' + pageClass}>
        <webview ref={(r) => { this.webview = r }} className={'webview ' + pageClass} src={url} preload='../../src/preloads/index.js'></webview>
        <FindMenu ref={(r) => { this.findMenu = r }} webview={this.webview} />
      </div>
    )
  }
}