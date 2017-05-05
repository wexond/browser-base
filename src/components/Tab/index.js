import React from 'react'
import Colors from '../../helpers/Colors'
import ReactDOM from 'react-dom'
import Transitions from '../../helpers/Transitions'

export default class Tab extends React.Component {
  constructor () {
    super()

    this.state = {
      selected: false,
      render: true,
      smallBorderVisible: true,
      leftSmallBorderVisible: false,
      pinned: false,
      favicon: '',
      loading: false,
      title: 'New tab',
      backgroundColor: 'transparent',
      closeOpacity: {value: 0, animate: false},
      faviconVisible: true,
      closePointerEvents: 'auto',
      pointerEvents: 'auto'
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

    this.blockLeftAnimation = true

    // Get positions for all tabs.
    tabs.getPositions(function (positions) {
      // Set initial position for the tab.
      self.removeTransition('left')
      self.appendTransition('width')

      self.setLeft(positions.tabPositions[global.tabs.indexOf(self)])
      setTimeout(function () {
        self.blockLeftAnimation = false
        // Set the widths and positions for all tabs.
        tabs.setWidths()
        tabs.setPositions()
      }, 1)
    })

    let event
    this.getDOMNode().addEventListener('page-load', event = function (e) {
      // Bind getPage to getPage passed by event.
      self.getPage = e.getPage
      self.getDOMNode().removeEventListener('page-load', event)
    })

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
    const self = this

    this.removeTransition('background-color')

    // Select tab (change background color etc).
    this.setState(
      {
        selected: true,
        closeOpacity: {
          value: 1,
          animate: false
        },
        backgroundColor: this.selectedBackgroundColor
      }
    )

    this.selected = true

    if (this.getPage == null || typeof (this.getPage) !== 'function' || this.getPage() == null) {
      // Wait until the page load.
      let event
      this.getDOMNode().addEventListener('page-load', event = function (e) {
        self.showPage()
        self.getDOMNode().removeEventListener('page-load', event)
      })
    } else {
      this.showPage()
    }

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

    this.removeTransition('background-color')

    // Deselect tab (change background color etc).
    this.setState(
      {
        selected: false,
        closeOpacity: {
          value: 0,
          animate: false
        },
        backgroundColor: 'transparent'
      }
    )

    this.selected = false

    tabs.updateTabs()
  }

  /**
   * Shows page associated with the tab.
   */
  showPage = () => {
    const page = this.getPage()
    const app = this.props.getApp()
    const bar = app.bar
    const webview = page.webview

    bar.hideSuggestions()

    // Show the associated page.
    page.setState({visible: true})

    if (webview.getWebContents() != null) {
      accessWebContents()
    } else {
      // Wait until the webview's webcontents load.
      let event
      webview.addEventListener('webcontents-load', event = function (e) {
        accessWebContents()
        webview.removeEventListener('webcontents-load', event)
      })
    }

    function accessWebContents () {
      // Refresh navigation icons in webview menu.
      app.webviewMenu.refreshNavIconsState()
      // Refresh navigation icons in tab menu.
      app.tabMenu.refreshNavIconsState()

      // Update bar text and focus it.
      app.updateBarText(webview.getURL(), true)
      if (bar.getText() === '') {
        bar.input.focus()
      }
    }
  }

  /**
   * Checks if mouse x position is on any tab.
   * If it is, then replaces current tab with second tab.
   * @param {number} cursorX
   */
  findTabToReplace = (cursorX) => {
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

      // Animate the tab
      self.appendTransition('left')
      self.setLeft(newTabPos)

      // Unlock tab replacing by other tabs.
      setTimeout(function () {
        self.locked = false
      }, global.tabsAnimationData.positioningDuration * 1000)

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

    let rgba = Colors.shadeColor(tabs.state.backgroundColor, -0.05)

    this.removeTransition('background-color')

    this.setState(
      {
        backgroundColor: rgba,
        pointerEvents: 'none'
      }
    )

    // Remove page associated to the tab.
    global.pages.splice(global.pages.indexOf(this.getPage()))
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
        nextTab.selectedAfterClose = true
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          tabs.selectTab(prevTab)
          prevTab.selectedAfterClose = true
        } else { // If the previous tab not exists, check if the first tab exists.
          if (global.tabs[0] != null) { // If first tab exists, select it.
            tabs.selectTab(global.tabs[0])
            global.tabs[0].selectedAfterClose = true
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
      self.appendTransition('width')
      if (self.tabDiv != null) {
        self.tabDiv.style.width = 0
      }

      setTimeout(function () {
        self.setState({render: false})
      }, global.tabsAnimationData.positioningDuration * 1000)
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

  /**
   * Appends transition property to tab.
   * @param {string} transition
   */
  appendTransition = (transition) => {
    var t = ''

    if (transition === 'left') {
      t = 'left ' + global.tabsAnimationData.positioningDuration + 's ' + global.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      t = 'width ' + global.tabsAnimationData.positioningDuration + 's ' + global.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      t = 'background-color ' + global.tabsAnimationData.positioningDuration + 's'
    }

    if (this.tabDiv != null) {
      this.tabDiv.style['-webkit-transition'] = Transitions.appendTransition(this.tabDiv.style['-webkit-transition'], t)
    }
  }

  /**
  * Removes transition property from tab.
  * @param {string} transition
  */
  removeTransition = (transition) => {
    var t = ''

    if (transition === 'left') {
      t = 'left ' + global.tabsAnimationData.positioningDuration + 's ' + global.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      t = 'width ' + global.tabsAnimationData.positioningDuration + 's ' + global.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      t = 'background-color ' + global.tabsAnimationData.positioningDuration + 's'
    }

    if (this.tabDiv != null) {
      this.tabDiv.style['-webkit-transition'] = Transitions.removeTransition(this.tabDiv.style['-webkit-transition'], t)
    }
  }

  /**
   * Sets left for tab.
   * @param {number} left
   */
  setLeft = (left) => {
    if (this.tabDiv != null) {
      this.tabDiv.style.left = left + 'px'
    }
  }

  /**
  * Sets width for tab.
  * @param {number} width
  */
  setWidth = (width) => {
    if (this.tabDiv != null) {
      this.tabDiv.style.width = width + 'px'
    }
  }

  /**
   * Gets DOM Node for current component.
   * @return {DOMElement}
   */
  getDOMNode = () => {
    return ReactDOM.findDOMNode(this)
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
      opacity: this.state.closeOpacity.value,
      transition: (this.state.closeOpacity.animate) ? global.tabsAnimationData.hoverDuration + 's opacity' : 'none',
      pointerEvents: (this.state.selected) ? 'auto' : this.state.closePointerEvents
    }

    let titleMaxWidthDecrease = 0

    if (this.state.closeOpacity.value === 1) {
      titleMaxWidthDecrease += 32
    } else {
      titleMaxWidthDecrease += 16
    }

    if (this.state.favicon !== '' || this.state.loading) { // If there is favicon or the tab is loading.
      titleMaxWidthDecrease += 32
    }

    let titleStyle = {
      display: (this.state.new || this.state.pinned)
        ? 'none'
        : 'block',
      maxWidth: `calc(100% - ${titleMaxWidthDecrease}px)`,
      left: (this.state.favicon === '' && !this.state.loading)
        ? 8
        : 32
    }

    let favOpacity = 0
    if (this.state.faviconVisible) {
      if (!(this.width < 48)) {
        if (this.state.selected) {
          favOpacity = 1
        }
      }
      if (!this.state.selected) {
        favOpacity = 1
      }
    }

    let faviconStyle = {
      backgroundImage: `url(${this.state.favicon})`,
      display: (this.state.favicon === '') ? 'none' : 'block',
      opacity: favOpacity
    }

    let tabStyle = {
      backgroundColor: this.state.backgroundColor,
      zIndex: (this.state.selected) ? 3 : 1,
      pointerEvents: this.state.pointerEvents
    }

    /** Events */

    let tabEvents = {
      onMouseDown: onMouseDown
    }

    function onMouseDown (e) {
      if (e.target.className === 'tab-close') {
        return
      }

      if (e.button !== 0) return

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

    if (!this.state.render) return null

    return (
      <div>
        <div {...tabEvents} style={Object.assign(tabStyle, this.props.style)} className='tab' ref={(r) => { this.tabDiv = r }}>
          <div className='tab-content'>
            <div className='tab-favicon' style={faviconStyle}>
            </div>
            <div className='tab-title' style={titleStyle}>
              {this.state.title}
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
  }
}
