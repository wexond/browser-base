import Component from '../../component'
import Store from '../../store'

import BarInfo from '../BarInfo'

export default class Bar extends Component {
  afterRender () {
    const self = this
    const barInfo = this.elements.barInfo

    this.updateInfo = barInfo.updateInfo
    this.setURL = barInfo.setURL
    this.setDomain = barInfo.setDomain
    this.setCertificate = barInfo.setCertificate

    this.elements.back.addEventListener('click', (e) => {
      const webview = Store.app.getSelectedPage().elements.webview

      if (webview.canGoBack()) {
        webview.goBack()
      }
    })

    this.elements.forward.addEventListener('click', (e) => {
      const webview = Store.app.getSelectedPage().elements.webview

      if (webview.canGoForward()) {
        webview.goForward()
      }
    })

    this.elements.refresh.addEventListener('click', (e) => {
      const webview = Store.app.getSelectedPage().elements.webview

      webview.reload()
    })

    this.elements.menu.addEventListener('click', (e) => {
      const menu = Store.app.elements.menu

      if (menu.isMenuToggled) {
        menu.hide()
      } else {
        menu.show()
        menu.elements.menu.setCSS({
          right: 16,
          top: 64,
          left: 'auto'
        })
      }
    })
  }

  updateNavigationIcons () {
    const webview = Store.app.getSelectedPage().elements.webview

    if (webview.canGoBack()) {
      this.elements.back.classList.remove('bar-icon-disabled')
    } else {
      this.elements.back.classList.add('bar-icon-disabled')
    }

    if (webview.canGoForward()) {
      this.elements.forward.classList.remove('bar-icon-disabled')
    } else {
      this.elements.forward.classList.add('bar-icon-disabled')
    }
  }

  render () {
    return (
      <div className='bar' ref='bar'>
        <div ref='back' className='bar-icon-back' />
        <div ref='forward' className='bar-icon-forward' />
        <div ref='refresh' className='bar-icon-refresh' />
        <BarInfo ref='barInfo' />
        <div ref='menu' className='bar-icon bar-icon-menu' />
      </div>
    )
  }
}
