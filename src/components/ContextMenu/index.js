import Component from '../../classes/Component'
import UI from '../../classes/UI'
import MenuItem from '../MenuItem'

export default class ContextMenu extends Component {
  /**
   * Shows menu.
   */
  show = () => {
    this.updateNavigationIcons()

    let separators = this.elements.menuItems.getElementsByClassName('context-menu-separator')
    let separatorsCount = 0
    for (var i = 0; i < separators.length; i++) {
      if (separators[i].css('display') === 'block') {
        separatorsCount += 1
      }
    }
    let topBottomPadding = 24
    let separatorsMargins = 16
    let navIconsHeight = 48
    this.height = navIconsHeight + separatorsCount + separatorsCount * separatorsMargins + topBottomPadding

    for (i = 0; i < this.menuItemsRendered.length; i++) {
      if (this.menuItemsRendered[i].props.show) {
        this.height += 32
      }
    }

    this.elements.menu.css({
      marginTop: 0,
      opacity: 1,
      height: this.height
    })
  }

  /**
   * Hides menu.
   */
  hide = () => {
    this.elements.menu.css({
      marginTop: -20,
      opacity: 0,
      height: 0
    })
  }

  /**
   * Refreshes navigation icons state (disabled or enabled etc)
   */
  updateNavigationIcons = () => {
    const webview = app.getSelectedPage().elements.webview
    if (webview.getWebContents() != null) {
      if (webview.canGoBack()) {
        this.elements.back.classList.remove('navigation-icon-disabled')
        this.elements.back.classList.add('navigation-icon-enabled')
      } else {
        this.elements.back.classList.add('navigation-icon-disabled')
        this.elements.back.classList.remove('navigation-icon-enabled')
      }

      if (webview.canGoForward()) {
        this.elements.forward.classList.remove('navigation-icon-disabled')
        this.elements.forward.classList.add('navigation-icon-enabled')
      } else {
        this.elements.forward.classList.add('navigation-icon-disabled')
        this.elements.forward.classList.remove('navigation-icon-enabled')
      }
    }
  }

  setPosition (left, top) {
    this.elements.menu.css({
      left: left,
      top: top
    })
  }

  updateItems (newItems) {
    this.menuItemsRendered = []
    this.menuItems = newItems

    while (this.elements.menuItems.firstChild) {
      this.elements.menuItems.firstChild.remove()
    }

    for (var i = 0; i < newItems.length; i++) {
      let title = newItems[i].title
      let show = newItems[i].show
      let enabled = newItems[i].enabled
      let onClick = newItems[i].onClick
  
      if (title !== 'Separator') {
        UI.render(
          <MenuItem show={show} onClick={onClick} enabled={enabled} menu={this}>{title}</MenuItem>, this.elements.menuItems, this
        )
      } else {
        UI.render(
          <div style={{display: (show) ? 'block' : 'none'}} className='context-menu-separator' />, this.elements.menuItems, this
        )
      }
    }
  }

  render () {
    const self = this

    function onBackClick () {
      const webview = app.getSelectedPage().elements.webview
      if (webview.canGoBack()) {
        webview.goBack()
        self.hide()
      }
    }

    function onForwardClick () {
      const webview = app.getSelectedPage().elements.webview
      if (webview.canGoForward()) {
        webview.goForward()
        self.hide()
      }
    }

    function onRefreshClick () {
      const webview = app.getSelectedPage().elements.webview
      webview.reload()
      self.hide()
    }

    function onMouseDown (e) {
      e.stopPropagation()
    }


    return (
      <div onMouseDown={onMouseDown} ref='menu' className='context-menu'>
        <div className='navigation-icons'>
          <div ref='back' onClick={onBackClick} className='navigation-icon-back navigation-icon-enabled' />
          <div ref='forward' onClick={onForwardClick} className='navigation-icon-forward navigation-icon-enabled' />
          <div ref='refresh' onClick={onRefreshClick} className='navigation-icon-refresh navigation-icon-enabled' />
          <div ref='favorite' className='navigation-icon-favorite navigation-icon-enabled' />
        </div>
        <div className='context-menu-line' />
        <div ref='menuItems' className='context-menu-items'>
          
        </div>
      </div>
    )
  }

  afterRender () {
    this.elements.menu.css({
      marginTop: -20,
      opacity: 0,
      height: 0
    })
  }
}