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
      visible: true,
      smallBorderVisible: true,
      leftSmallBorderVisible: false,
      closeVisible: true,
      pinned: false,
      new: true,
      favicon: '',
      loading: false,
      animateBackgroundColor: false,
      backgroundColor: '#fff'
    }

    this.selectedBackgroundColor = '#fff'
    this.new = true
  }

  componentDidMount () {
    const tabs = this.props.getTabs()

    // Add this to the global tab collection.
    global.tabs.push(this)

    // Get positions for all tabs.
    var positions = tabs.getPositions().tabPositions

    // Set initial position for the tab.
    this.setState({
      left: positions[global.tabs.indexOf(this)]
    }, function () {
      // Set the widths and positions for all tabs.
      tabs.setWidths()
      tabs.setPositions()
    })

    // Select the tab if prop select is true.
    if (this.props.select) {
      tabs.selectTab(this)
    }

    // Hide new tab button on tab create.
    tabs.setState({addButtonVisible: false})

    tabs.canShowAddButton = false
  }

  /**
   * Changes from new tab (the small tab) to normal tab.
   */
  normalTab = () => {
    const tabs = this.props.getTabs()

    // Change tab mode to normal.
    this.setState({new: false})
    this.new = false

    // Show the new tab button.
    tabs.setState({addButtonVisible: true})

    // Set the widths and positions for all tabs.
    tabs.setWidths()
    tabs.setPositions()

    tabs.canShowAddButton = true
  }

  /**
   * Pins or unpins tab.
   */
  pin = () => {
    const tabs = this.props.getTabs()

    if (!this.pinned) {
      this.setState({pinned: true})
    } else {
      this.setState({pinned: false})
    }

    this.pinned = !this.pinned

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

    // Show the associated page.
    page.setState({visible: true})

    // Select tab (change background color etc).
    this.setState({animateBackgroundColor: false, selected: true, backgroundColor: this.selectedBackgroundColor, closeVisible: true})

    this.selected = true

    var bar = this.props.getApp().getBar()
    bar.hideSuggestions()

    setTimeout(function () {
      if (self.getPage().getWebView().getWebContents() != null) {
        // Refresh navigation icons in Menu.
        var menu = global.menuWindow
        var webview = self.getPage().getWebView()

        menu.send('webview:can-go-back', webview.canGoBack())
        menu.send('webview:can-go-forward', webview.canGoForward())

        self.props.getApp().updateBarText(webview.getURL())
        if (bar.getText() === '') {
          bar.input.focus()
        }
      }
    }, 1)

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
      tabs.closeTab(this)
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
      var overTab = tabs.getTabFromMousePoint(this, cursorX)

      if (overTab != null && !overTab.pinned) {
        var indexTab = global.tabs.indexOf(this)
        var indexOverTab = global.tabs.indexOf(overTab)

        tabs.replaceTabs(indexTab, indexOverTab)
      }
    }
  }

  /**
   * Gets page associated with tab.
   * @return {Page}
   */
  getPage = () => {
    return this.refs.page
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

    var displaySmallBorder = 'none'

    if (this.state.visible) {
      if (!this.state.selected && this.state.smallBorderVisible) {
        displaySmallBorder = 'block'
      }
    }

    var borderLeftSmallStyle = {
      left: 0,
      display: (this.state.leftSmallBorderVisible) ? 'block' : 'none'
    }

    var borderSmallStyle = {
      right: 0,
      display: displaySmallBorder,
      backgroundColor: tabs.state.borderColor
    }

    var borderRightStyle = {
      display: (this.state.selected && this.state.visible)
        ? 'block'
        : 'none',
      right: -1,
      backgroundColor: tabs.state.borderColor
    }

    var borderLeftStyle = {
      display: (this.state.selected && global.tabs.indexOf(this) !== 0 && this.state.visible)
        ? 'block'
        : 'none',
      backgroundColor: tabs.state.borderColor
    }
    var closeStyle = {
      display: (this.state.pinned) ? 'none' : 'block',
      opacity: (this.state.closeVisible) ? 1 : 0
    }

    var titleMaxWidthDecrease = 0
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

    var titleStyle = {
      display: (this.state.new || this.state.pinned)
        ? 'none'
        : 'block',
      maxWidth: `calc(100% - ${titleMaxWidthDecrease}px)`,
      left: (this.state.favicon === '' && !this.state.loading)
        ? 12
        : 32
    }
    var faviconStyle = {
      backgroundImage: (this.state.favicon !== '') ? 'url(' + this.state.favicon + ')' : '',
      display: (this.state.favicon === '') ? 'none' : 'block'
    }

    /** Events */

    var tabEvents = {
      onMouseDown: onMouseDown,
      onDoubleClick: onDoubleClick,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave
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
      self.props.getTabs().closeTab(self)
    }

    function onRest () {
      if (self.hiding) {
        self.setState({render: false})
      }
    }

    function onDoubleClick () {
      self.pin()
    }

    function onMouseEnter () {
      if (!self.selected) {
        var rgba = Colors.shadeColor(tabs.state.backgroundColor, 0.05)
        self.mouseLeaveBackgroundColor = tabs.state.backgroundColor
        self.setState({backgroundColor: rgba, animateBackgroundColor: true})
        if (!self.pinned) {
          self.setState({closeVisible: true})
        }
      }
    }

    function onMouseLeave () {
      if (!self.selected) {
        self.setState({backgroundColor: self.mouseLeaveBackgroundColor, animateBackgroundColor: true, closeVisible: false})
        setTimeout(function () {
          self.setState({animateBackgroundColor: false})
        }, 200)
      }
    }

    if (this.state.render) {
      return (
        <div>
          <Motion style={{left: this.state.left, width: this.state.width}} onRest={onRest}>
            {value =>
              <div {...tabEvents} style={
              {
                left: value.left,
                width: value.width,
                backgroundColor: this.state.backgroundColor,
                zIndex: (this.state.selected) ? 3 : 1,
                transition: (this.state.animateBackgroundColor)
                ? '0.2s background-color'
                : 'none'
              }} className='tab' ref={(t) => { this.tab = t }}>
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
              </div>}
          </Motion>

          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              ref: 'page',
              getTab: self.getTab,
              getApp: self.props.getApp
            })
          })}
        </div>
      )
    } else {
      return null
    }
  }
}
