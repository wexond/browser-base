import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Storage from '../../utils/storage'
import Colors from '../../utils/colors'

import * as filesActions from '../../actions/files'
import * as tabsActions from '../../actions/tabs'
import * as webviewActions from '../../actions/webview'

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

    const updateInfo = async (e) => {
      Store.app.refreshIconsState()

      if (e.url != null) {
        if (e.isMainFrame != null && !e.isMainFrame) return
        tab.url = e.url
        Store.url = e.url
        if (Store.selectedTab === tab.id) {
          Store.app.bar.addressBar.setInfo(e.url)
        }
        if (lastURL === e.url) {
          if (historyId !== -1) {
            const history = await Storage.get('history')
            history.filter(item => { return item.id === historyId })[0].url = e.url
            Storage.saveHistory(history)
          }
          if (siteId !== -1) {
            const sites = await Storage.get('sites')
            sites.filter(item => { return item.id === siteId })[0].url = e.url
            Storage.saveSites(sites)
          }
        }
      }
    }

    this.webview.addEventListener('did-stop-loading', updateInfo)
    this.webview.addEventListener('did-navigate', updateInfo)
    this.webview.addEventListener('did-navigate-in-page', updateInfo)
    this.webview.addEventListener('will-navigate', updateInfo)

    this.webview.addEventListener('load-commit', async (e) => {
      tab.url = e.url
      if (e.url !== lastURL && e.isMainFrame) {
        lastURL = e.url
        filesActions.checkFiles()

        const regex = /(http(s?)):\/\/(www.)?/gi
        let url = tab.url
        if (url.indexOf('/', 9) !== -1) {
          url = url.substring(0, url.indexOf('/', 9))
        }

        historyId = await Storage.addHistoryItem('', e.url, '', '')
        siteId = await Storage.addSite('', url, '')
      }
    })

    this.webview.addEventListener('dom-ready', async (e) => {
      if (lastURL === tab.url) {
        const ogData = await webviewActions.getOGData(this.webview)

        if (historyId !== -1) {
          const history = await Storage.get('history')
          history.filter(item => { return item.id === historyId })[0].ogData = ogData
          Storage.saveHistory(history)
        }
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
            favicon = 'error'
          } else {
            Storage.addFavicon(e.favicons[0])
            tab.favicon = e.favicons[0]
            favicon = e.favicons[0]

            if (lastURL === tab.url) {
              if (historyId !== -1) {
                const history = await Storage.get('history')
                history.filter(item => { return item.id === historyId })[0].favicon = favicon
                Storage.save('history', history)
              }
              if (siteId !== -1) {
                const sites = await Storage.get('sites')
                sites.filter(item => { return item.id === siteId })[0].favicon = favicon
                Storage.save('sites', sites)
              }
            }
          }
        }
      }

      request.open('GET', e.favicons[0], true)
      request.send(null)
    })

    this.webview.addEventListener('page-title-updated', async (e) => {
      tab.title = e.title

      if (lastURL === tab.url) {
        if (historyId !== -1) {
          const history = await Storage.get('history')
          history.filter(item => { return item.id === historyId })[0].title = e.title
          Storage.save('history', history)
        }
        if (siteId !== -1) {
          const sites = await Storage.get('sites')
          sites.filter(item => { return item.id === siteId })[0].title = e.title
          Storage.save('sites', sites)
        }
      }
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
