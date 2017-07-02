import Component from '../../classes/Component'
import UI from '../../classes/UI'
import MenuItem from '../MenuItem'

export default class Menu extends Component {
  beforeRender () {
    this.defaultProps = {
      showNavigationIcons: false
    }
    this.isMenuToggled = false
  }
  /**
   * Shows menu.
   */
  show = () => {
    if (this.props.showNavigationIcons) this.updateNavigationIcons()

    let separators = this.elements.menuItems.getElementsByClassName('menu-separator')
    let separatorsCount = 0
    for (var i = 0; i < separators.length; i++) {
      if (separators[i].css('display') === 'block') {
        separatorsCount += 1
      }
    }
    let topBottomPadding = 24
    let separatorsMargins = 16
    let navIconsHeight = (this.props.showNavigationIcons) ? 48 : 8
    this.height = navIconsHeight + separatorsCount + separatorsCount * separatorsMargins + topBottomPadding

    this.elements.menuItems.css({
      paddingTop: (!this.props.showNavigationIcons) ? 16 : 8
    })

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

    this.isMenuToggled = true
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

    this.isMenuToggled = false
  }

  /**
   * Refreshes navigation icons state (disabled or enabled etc)
   */
  updateNavigationIcons = () => {
    const webview = app.getSelectedPage().elements.webview
    const disabledClassName = 'menu-navigation-icon-disabled'

    if (webview.getWebContents() != null) {
      if (webview.canGoBack()) {
        this.elements.back.classList.remove(disabledClassName)
      } else {
        this.elements.back.classList.add(disabledClassName)
      }

      if (webview.canGoForward()) {
        this.elements.forward.classList.remove(disabledClassName)
      } else {
        this.elements.forward.classList.add(disabledClassName)
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
          <div style={{display: (show) ? 'block' : 'none'}} className='menu-separator' />, this.elements.menuItems, this
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

    let navigationIcons = null

    if (this.props.showNavigationIcons) {
      navigationIcons = (
        <div className='menu-navigation-icons'>
          <div ref='back' onClick={onBackClick} className='menu-navigation-icon-back' />
          <div ref='forward' onClick={onForwardClick} className='menu-navigation-icon-forward' />
          <div ref='refresh' onClick={onRefreshClick} className='menu-navigation-icon-refresh' />
          <div ref='favorite' className='menu-navigation-icon-favorite' />
        </div>
      )
    }

    return (
      <div onMouseDown={onMouseDown} ref='menu' className='menu'>
        {navigationIcons}
        <div className='menu-line' />
        <div ref='menuItems' className='menu-items' />
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