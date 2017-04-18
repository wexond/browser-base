import React from 'react'
import {Motion, spring} from 'react-motion'
import Colors from '../../../../../../helpers/Colors'

export default class Tab extends React.Component {
  constructor () {
    super()

    this.state = {
      width: 0,
      left: 0,
      selected: false,
      render: true,
      smallBorderVisible: true,
      leftSmallBorderVisible: false,
      closeVisible: true,
      pinned: false,
      favicon: '',
      loading: false,
      animateBackgroundColor: false,
      backgroundColor: '#fff',
      animate: false
    }

    this.selectedBackgroundColor = '#fff'
  }

  componentDidMount () {
    const tabs = this.props.getTabs()
    const app = this.props.getApp()
    const self = this

    // Add page associated to the tab and give access to the tab.
    app.setState(previousState => ({
      pagesToCreate: [...previousState.pagesToCreate, {url: this.props.url, getTab: this.getTab}]
    }))

    // Add this to the global tab collection.
    global.tabs.push(this)

    global.tabs[global.tabs.indexOf(this)].staticIndex = global.tabs.indexOf(this)

    // Get positions for all tabs.
    tabs.getPositions(function (positions) {
      // Set initial position for the tab.
      self.setState({
        left: positions.tabPositions[global.tabs.indexOf(self)]
      }, function () {
        setTimeout(function () {
          // Set the widths and positions for all tabs.
          tabs.setWidths()
          tabs.setPositions()
        }, 1)
      })
    })
  }

  /**
   * Executed when the page associated with the tab has loaded.
   * Gives access to the page.
   * @event
   * @param {function} getPage
   */
  onPageLoad = (getPage) => {
    const tabs = this.props.getTabs()
    this.getPage = getPage

    // Select the tab if prop select is true.
    if (this.props.select) {
      tabs.selectTab(this)
    }
  }

  /**
   * Pins or unpins tab.
   */
  pin = () => {
    const tabs = this.props.getTabs()

    // Set pinned state.
    if (!this.pinned) {
      this.setState({pinned: true})
    } else {
      this.setState({pinned: false})
    }

    this.pinned = !this.pinned

    // Move the pinned tab to first position.
    var tempTabs = []
    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i].pinned) {
        tempTabs.push(global.tabs[i])
      }
    }

    for (i = 0; i < global.tabs.length; i++) {
      if (!global.tabs[i].pinned) {
        tempTabs.push(global.tabs[i])
      }
    }
    global.tabs = tempTabs

    // Calculate all widths and positions for all tabs.
    tabs.setWidths()
    tabs.setPositions()
  }

  /**
   * Selects tab and shows the associated page with tab.
   */
  select = () => {
    const tabs = this.props.getTabs()
    const page = this.getPage()
    const self = this
    const bar = this.props.getApp().getBar()

    // Show the associated page.s
    page.setState({visible: true})

    // Select tab (change background color etc).
    this.setState({animateBackgroundColor: false, selected: true, backgroundColor: this.selectedBackgroundColor, closeVisible: true})

    this.selected = true

    bar.hideSuggestions()

    setTimeout(function () {
      if (self.getPage().getWebView().getWebContents() != null) {
        const menu = global.menuWindow
        const webview = self.getPage().getWebView()

        // Refresh navigation icons in Menu.
        menu.send('webview:can-go-back', webview.canGoBack())
        menu.send('webview:can-go-forward', webview.canGoForward())

        // Update bar text and focus it.
        self.props.getApp().updateBarText(webview.getURL())
        if (bar.getText() === '') {
          bar.input.focus()
        }
      }
    }, 1)

    // Center vertically bar when the selected tab is new.
    bar.setState({centerVertical: this.new})

    tabs.updateTabs()
  }

  /**
   * Deselects tab and hides the associated page with tab.
   */
  deselect = () => {
    const tabs = this.props.getTabs()
    const page = this.getPage()

    // Hide the associated page.
    page.setState({visible: false})

    // Deselect tab (change background color etc).
    this.setState({animateBackgroundColor: false, selected: false, backgroundColor: 'transparent', closeVisible: false})

    this.selected = false

    tabs.updateTabs()

    if (this.new) {
      tabs.canShowAddButton = true
      this.closeNew()
    }
  }

  /**
   * Checks if mouse x position is on any tab.
   * If it is, then replaces current tab with second tab.
   * @param {number} cursorX
   */
  reorderTabs = (cursorX) => {
    const tabs = this.props.getTabs()
    if (!this.pinned) {
      const overTab = tabs.getTabFromMouseX(this, cursorX)

      if (overTab != null && !overTab.pinned) {
        const indexTab = global.tabs.indexOf(this)
        const indexOverTab = global.tabs.indexOf(overTab)

        tabs.replaceTabs(indexTab, indexOverTab)
      }
    }
  }

  /**
   * Updates position of tab to its place.
   */
  updatePosition = () => {
    const tabs = this.props.getTabs()
    const self = this

    tabs.getPositions(function (data) {
      // Get new position for the tab.
      const newTabPos = data.tabPositions[global.tabs.indexOf(self)]

      // Unable to reorder the tab by other tabs.
      self.locked = true

      // Animate the tab.
      self.setState({
        left: newTabPos
      })

      // Unlock tab reordering by other tabs.
      setTimeout(function () {
        self.locked = false
      }, 200)

      tabs.updateTabs()

      // Show or hide tab's borders.
      if (newTabPos === 0) {
        self.setState({leftBorderVisible: false})
      } else {
        self.setState({leftBorderVisible: true})
      }
    })
  }

  /**
   * Closes the tab.
   */
  close = () => {
    const self = this
    const tabs = this.props.getTabs()
    // If the tab is last tab.
    if (global.tabs.length === 1) {
      tabs.setState({tabsVisible: false})
      tabs.addTab()
    }

    tabs.timer.canReset = true

    // Remove page associated to the tab.
    this.getPage().setState({render: false})

    // Get previous and next tab.
    var index = global.tabs.indexOf(this)
    var nextTab = global.tabs[index + 1]
    var prevTab = global.tabs[index - 1]

    // Remove the tab from array.
    global.tabs.splice(index, 1)

    if (this.selected) {
      if (nextTab != null) { // If the next tab exists, select it.
        tabs.selectTab(nextTab)
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          tabs.selectTab(prevTab)
        } else { // If the previous tab not exists, check if the first tab exists.
          if (global.tabs[0] != null) { // If first tab exists, select it.
            tabs.selectTab(global.tabs[0])
          }
        }
      }
    }

    if (index === global.tabs.length) { // If the tab is last.
      // Calculate all widths and positions for all tabs.
      tabs.setWidths()
      tabs.setPositions()

      if (this.width < 190) { // If tab width is less than normal tab width.
        this.setState({render: false}) // Just remove it.
      } else {
        closeAnim() // Otherwise, animate the tab.
      }
    } else {
      closeAnim() // Otherwise, animate the tab.
    }

    // Animate tab closing.
    function closeAnim () {
      // Animate.
      self.setState({
        animate: true,
        width: 0
      })

      setTimeout(function () {
        self.setState({render: false})
      }, 200)
    }

    tabs.timer.time = 0

    // Calculate positions for all tabs, but don't calculate widths.
    tabs.setPositions()
  }

  /**
   * Gets this {Tab}.
   * @return {Tab}
   */
  getTab = () => {
    return this
  }

  render () {
    const self = this
    const tabs = this.props.getTabs()

    /** Styles */

    let displaySmallBorder = 'none'

    if (!this.state.selected && this.state.smallBorderVisible) {
      displaySmallBorder = 'block'
    }

    let borderLeftSmallStyle = {
      left: 0,
      display: (this.state.leftSmallBorderVisible) ? 'block' : 'none'
    }

    let borderSmallStyle = {
      right: 0,
      display: displaySmallBorder,
      backgroundColor: tabs.state.borderColor
    }

    let borderRightStyle = {
      display: (this.state.selected)
        ? 'block'
        : 'none',
      right: -1,
      backgroundColor: tabs.state.borderColor
    }

    let borderLeftStyle = {
      display: (this.state.selected && global.tabs.indexOf(this) !== 0)
        ? 'block'
        : 'none',
      backgroundColor: tabs.state.borderColor
    }

    let closeStyle = {
      display: (this.state.pinned) ? 'none' : 'block',
      opacity: (this.state.closeVisible) ? 1 : 0
    }

    let titleMaxWidthDecrease = 0
    if (this.state.closeVisible) {
      titleMaxWidthDecrease += 28
    } else {
      titleMaxWidthDecrease += 16
    }
    if (this.state.favicon === '' && !this.state.loading) {
      titleMaxWidthDecrease += 16
    } else {
      titleMaxWidthDecrease += 32
    }

    let titleStyle = {
      display: (this.state.new || this.state.pinned)
        ? 'none'
        : 'block',
      maxWidth: `calc(100% - ${titleMaxWidthDecrease}px)`,
      left: (this.state.favicon === '' && !this.state.loading)
        ? 12
        : 32
    }

    let faviconStyle = {
      backgroundImage: (this.state.favicon !== '') ? 'url(' + this.state.favicon + ')' : '',
      display: (this.state.favicon === '') ? 'none' : 'block'
    }

    let tabStyle = {
      left: this.state.left,
      width: this.state.width,
      backgroundColor: this.state.backgroundColor,
      zIndex: (this.state.selected) ? 3 : 1,
      transitionProperty: (this.state.animateBackgroundColor)
      ? 'background-color, left, width'
      : 'left, width',
      transition: (this.state.animate) ? '0.2s all' : 'none'
    }

    /** Events */

    let tabEvents = {
      onMouseDown: onMouseDown,
      onDoubleClick: onDoubleClick
    }

    function onMouseDown (e) {
      if (e.target.className === 'tab-close') {
        return
      }

      tabs.selectTab(self)

      // Initialize the dragData object in {Tabs}.
      tabs.dragData = {
        tabX: e.currentTarget.offsetLeft,
        mouseClickX: e.clientX,
        canDrag: !self.pinned,
        tab: self
      }

      if (!self.state.new && !self.state.pinned) {
        window.addEventListener('mousemove', tabs.onMouseMove)
      }
    }

    function onClickClose (e) {
      self.close()
    }

    function onDoubleClick () {
      self.pin()
    }

    if (this.state.render) {
      return (
        <div>
          <div {...tabEvents} style={Object.assign(tabStyle, this.props.style)} className='tab' ref='tab'>
            <div className='tab-content'>
              <div className='tab-title' style={titleStyle}>
                New tab
              </div>
              <div style={closeStyle} className='tab-close-container'>
                <div className='tab-close' onClick={onClickClose} />
              </div>
            </div>
            <div className='tab-border-small' style={borderLeftSmallStyle} />
            <div className='tab-border-small' style={borderSmallStyle} />
            <div className='tab-border-full' style={borderLeftStyle} />
            <div className='tab-border-full' style={borderRightStyle} />
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}
