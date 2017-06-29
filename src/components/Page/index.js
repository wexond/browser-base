import Component from '../../classes/Component'

export default class Page extends Component {
  beforeRender () {
    this.tab = this.props.tab
  }

  render () {
    return (
      <div className='page' ref='page'>
        <webview ref='webview' className='page-webview' src='https://google.pl' />
      </div>
    )
  }

  afterRender () {
    const self = this

    this.elements.webview.addEventListener('page-title-updated', (e) => {
      const url = self.elements.webview.getURL()
      let hostname = url

      hostname = url.split('://')[1]

      hostname = hostname.split(':')[0]
      hostname = hostname.split('?')[0]
      hostname = hostname.split('/')[0]

      self.tab.setTitle(e.title)

      app.elements.bar.setTitle(e.title)
      app.elements.bar.setDomain(hostname)
    })

    this.elements.webview.addEventListener('page-favicon-updated', (e) => {
      self.tab.setFavicon(e.favicons[0])
    })

    if (window.app != null) {
      let appElements = window.app.elements
      let tabsHeight = appElements.tabs.elements.tabs.offsetHeight
      let barHeight = appElements.bar.elements.bar.offsetHeight
      let height = tabsHeight + barHeight

      this.elements.page.css('height', 'calc(100vh - ' + height + 'px)')
    }
  }

  /**
   * Shows page div.
   */
  show () {
    this.elements.page.css({
      pointerEvents: 'auto',
      position: 'relative',
      top: 0,
      visibility: 'visible'
    })
  }

  /**
   * Hides page div.
   */
  hide () {
    this.elements.page.css({
      pointerEvents: 'none',
      position: 'absolute',
      top: -99999,
      visibility: 'hidden'
    })
  }
}