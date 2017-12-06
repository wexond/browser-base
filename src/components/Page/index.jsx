import Component from 'inferno-component'

import { connect } from 'inferno-mobx'
import Store from '../../store'

@connect
export default class Page extends Component {
  componentDidMount () {
    const tab = this.props.tab
    const page = this.props.page

    page.page = this

    page.webview = this.webview

    this.webview.addEventListener('did-stop-loading', (e) => {
      Store.app.bar.refreshIconsState()
    })

    const didNavigate = (e) => {
      tab.url = e.url
      Store.url = e.url
      Store.app.bar.setInfo(e.url)
      Store.app.bar.setInputToggled(false)
    }

    this.webview.addEventListener('did-navigate', didNavigate)
    this.webview.addEventListener('did-navigate-in-page', didNavigate)

    this.webview.addEventListener('will-navigate', (e) => {
      tab.url = e.url
      Store.url = e.url
      Store.app.bar.setInfo(tab.url)
    })

    let checkWebcontentsInterval = setInterval(() => {
      if (this.webview.getWebContents() != null) {
        event = new Event('webcontents-load')
        this.webview.dispatchEvent(event)

        this.webview.getWebContents().on('context-menu', onContextMenu)

        clearInterval(checkWebcontentsInterval)
      }
    }, 1)

    const onContextMenu = (e, params) => {
      Store.app.menu.setState((previousState) => {
        /**
         * 0  : Open link in new tab
         * 1  : -----------------------
         * 2  : Copy link address
         * 3  : Save link as
         * 4  : -----------------------
         * 5  : Open image in new tab
         * 6  : Save image as
         * 7  : Copy image
         * 8  : Copy image address
         * 9  : -----------------------
         * 10 : Save as
         * 11 : Print
         * 12 : -----------------------
         * 13 : View source
         * 14 : Inspect element
         */
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

      Store.app.menu.show()
      Store.app.pageMenuData = params

      let x = Store.cursor.x
      let y = Store.cursor.y

      let left = x + 1
      let top = y + 1

      if (left + 300 > window.innerWidth) {
        left = x - 301
      }

      if (top + Store.app.menu.newHeight > window.innerHeight) {
        top = y - Store.app.menu.newHeight
      }

      if (top < 0) {
        top = 96
      }

      Store.app.menu.setState({left: left, top: top})
    }
  }

  goBack () {
    this.webview.goBack()
    Store.app.bar.refreshIconsState()
  }

  goForward () {
    this.webview.goForward()
    Store.app.bar.refreshIconsState()
  }

  refresh () {
    this.webview.reload()
    Store.app.bar.refreshIconsState()
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
        <webview ref={(r) => { this.webview = r }} className={'webview ' + pageClass} src={url}></webview>
      </div>
    )
  }
}
