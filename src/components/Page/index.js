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
      self.tab.setTitle(e.title)
    })

    this.elements.webview.addEventListener('page-favicon-updated', (e) => {
      self.tab.setFavicon(e.favicons[0])
    })
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