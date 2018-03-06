import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import { ipcRenderer } from 'electron'

import Colors from '../../utils/colors'
import * as storage from '../../utils/storage'

import * as filesActions from '../../actions/files'
import * as tabsActions from '../../actions/tabs'
import * as webviewActions from '../../actions/webview'

import extensionsDefaults from '../../defaults/extensions'
import ipcMessages from '../../defaults/ipc-messages'
import wexondUrls from '../../defaults/wexond-urls'

import FindMenu from '../FindMenu'
import Tab from '../Tab';

interface Props {
  tab: Tab,
  page: Page,
}

interface State {

}

@observer
export default class Page extends React.Component<Props, State> {

  public page: Page
  public webview: HTMLWebViewElement
  public findMenu: FindMenu
  public url: string
  public id: number
  
  public async componentDidMount() {
    const tab = this.props.tab
    const page = this.props.page
    let lastURL = ''

    filesActions.checkFiles()

    let historyId = -1
    let siteId = -1

    page.page = this

    const updateData = async () => {
      if (lastURL === tab.url && tab != null) {
        if (historyId !== -1) {
          const query = `UPDATE history SET title = ?, url = ?, favicon = ?, ogTitle = ?, ogDescription = ?, ogImage = ? WHERE rowid = ?`
          const data = [tab.title, tab.url, tab.favicon, tab.ogData.title, tab.ogData.description, tab.ogData.image, historyId]
          storage.history.run(query, data)
        }

        if (siteId !== -1) {
          const query = `UPDATE history SET title = ?, favicon = ?, ogTitle = ?, ogDescription = ?, ogImage = ? WHERE rowid = ?`
          const data = [tab.title, tab.favicon, null, null, null, siteId]
          storage.history.run(query, data)
        }
      }
    }

    const updateInfo = async (e: any) => {
      Store.app.refreshIconsState()

      if (e.url != null) {
        if (e.isMainFrame != null && !e.isMainFrame) { return }
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

    const executeExtensionEvent = (name: string, eventObject: any) => {
      for (let i = Store.extensions.length; i--;) {
        Store.extensions[i].backgroundExtension.webview.send(ipcMessages.EXTENSION_EXECUTE_EVENT + name, eventObject)
      }
    }

    this.webview.addEventListener('did-stop-loading', updateInfo)
    this.webview.addEventListener('did-navigate', updateInfo)
    this.webview.addEventListener('did-navigate-in-page', updateInfo)
    this.webview.addEventListener('will-navigate', updateInfo)

    this.webview.addEventListener('load-commit', async (e: any) => {
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
          url = url.substring(0, url.indexOf('/', 9) + 1)
        }

        if (!e.url.startsWith('wexond://')) {
          storage.history.run(`INSERT INTO history(title, url, favicon, date) VALUES (?, ?, ?, DATETIME('now', 'localtime'))`, [tab.title, e.url, tab.favicon], function (err: Error) {
            historyId = this.lastID
          })

          storage.history.run(`INSERT INTO history(title, url, favicon, date) SELECT ?, ?, ?, DATETIME('now', 'localtime') WHERE NOT EXISTS(SELECT 1 FROM history WHERE url = ?)`, [tab.title, url, tab.favicon, url], function (err: Error) {
            if (this.changes > 0) {
              siteId = this.lastID
            } else {
              siteId = -1
            }

            console.log(siteId)
          })
        } else { historyId = -1 }
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

    this.webview.addEventListener('new-window', (e: any) => {
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

    this.webview.addEventListener('page-favicon-updated', (e: any) => {
      const request = new XMLHttpRequest()
      request.onreadystatechange = async (event) => {
        if (request.readyState === 4) {
          if (request.status === 404) {
            tab.favicon = ''
          } else {
            tab.favicon = e.favicons[0]
            storage.addFavicon(e.favicons[0])
          }
          updateData()
        }
      }

      request.open('GET', e.favicons[0], true)
      request.send(null)
    })

    this.webview.addEventListener('page-title-updated', async (e: any) => {
      tab.title = e.title
      updateData()
    })

    this.webview.addEventListener('did-change-theme-color', (e: any) => {
      let color = e.themeColor
      if (color == null) { color = '#fff' }

      Store.backgroundColor = color
      tab.backgroundColor = color
      Store.foreground = Colors.getForegroundColor(color)
      Colors.getForegroundColor(color)
    })

    // When webcontents of a webview are not available,
    // we can't use them, so we need to check if 
    // these webcontents are not null, 
    // and then use them.
    const checkWebcontentsInterval = setInterval(() => {
      // We need to use webcontents,
      // to add an event listener `context-menu`.
      if (this.webview.getWebContents() != null) {
        this.webview.getWebContents().on('context-menu', onContextMenu)

        // When these webcontents are finally not null,
        // just remove the interval.
        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    const onContextMenu = (e: any, params: any) => {
      Store.app.pageMenu.setState((previousState: any) => {
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

        const menuItems = previousState.items
        // Hide or show first 5 items.
        for (let i = 0; i < 5; i++) {
          menuItems[i].visible = params.linkURL !== ''
        }

        // Next 5 items.
        for (let i = 5; i < 10; i++) {
          menuItems[i].visible = params.hasImageContents
        }

        // Next 4 items.
        for (let i = 10; i < 14; i++) {
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
      const x = Store.cursor.x
      const y = Store.cursor.y

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
      Store.app.pageMenu.setState({ left, top })
    }

    this.registerSwipeListener()
  }

  public registerSwipeListener() {
    const trackingFingers = false
    const startTime = 0
    const isSwipeOnLeftEdge = false
    const isSwipeOnRightEdge = false
    let deltaX = 0
    let deltaY = 0
    let time

    /*ipcRenderer.on('scroll-touch-begin', () => {
      trackingFingers = true
      startTime = (new Date()).getTime()
    })*/

    this.webview.addEventListener('wheel', (e) => {
      if (trackingFingers) {
        deltaX = deltaX + e.deltaX
        deltaY = deltaY + e.deltaY
        time = (new Date()).getTime() - startTime
      }
    })

    /*ipcRenderer.on('scroll-touch-end', () => {
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
    })*/

  }

  public goBack() {
    this.webview.goBack()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  public goForward() {
    this.webview.goForward()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  public refresh() {
    this.webview.reload()
    Store.app.bar.addressBar.setInputToggled(false, true)
    Store.app.refreshIconsState()
  }

  public render(): JSX.Element {
    const tab = this.props.tab
    const page = this.props.page
    const isSelected = Store.selectedTab === tab.id

    const {
      url
    } = this.props.page

    const pageClass = (isSelected) ? '' : 'hide'

    return (
      <div className={ 'page ' + pageClass }>
        <webview ref={ (r) => { this.webview = r } } className={ 'webview ' + pageClass } src={ url } preload='../../src/preloads/index.js'></webview>
        <FindMenu ref={ (r) => { this.findMenu = r } } webview={ this.webview } />
      </div>
    )
  }
}