import React from 'react'
import {Motion, spring} from 'react-motion'

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
      pinned: false,
      new: true
    }

    this.background = '#fff'
    this.hiding = false
    this.selected = false
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
   * Pins tab.
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

    // Show the associated page.
    page.setState({visible: true})

    // Select tab (change background color etc).
    this.setState({selected: true})

    this.selected = true

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
    this.setState({selected: false})

    this.selected = false

    tabs.updateTabs()

    if (this.new) {
      tabs.canShowAddButton = true
      tabs.closeTab(this)
      tabs.setState({addButtonVisible: true})
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

    var tabEvents = {
      onMouseDown: onMouseDown,
      onDoubleClick: onDoubleClick
    }

    var displaySmallBorder = 'none'

    if (this.state.visible) {
      if (!this.state.selected && this.state.smallBorderVisible) {
        displaySmallBorder = 'block'
      }
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
      right: 0,
      backgroundColor: tabs.state.borderColor
    }

    var borderLeftStyle = {
      display: (this.state.selected && global.tabs.indexOf(this) !== 0 && this.state.visible)
        ? 'block'
        : 'none',
      backgroundColor: tabs.state.borderColor
    }
    var titleStyle = {
      display: (this.state.new || this.state.pinned) ? 'none' : 'block'
    }
    var closeStyle = {
      display: (this.state.pinned) ? 'none' : 'block'
    }

    /** Events */

    function onMouseDown (e) {
      var tabs = self.props.getTabs()
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

    function onClickClose () {
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

    if (this.state.render) {
      return (
        <div>
          <Motion style={{left: this.state.left, width: this.state.width}} onRest={onRest}>
            {value =>
              <div {...tabEvents} style={
              {
                left: value.left,
                width: value.width,
                backgroundColor: (this.state.selected) ? this.backgroundColor : tabs.state.backgroundColor,
                zIndex: (this.state.selected) ? 3 : 1
              }} className='tab' ref={(t) => { this.tab = t }}>
                <div className='tab-content'>
                  <div className='tab-title' style={titleStyle}>
                    New tab
                  </div>
                  <div className='tab-close' onClick={onClickClose} style={closeStyle} />
                </div>
                <div className='tab-border' style={borderSmallStyle} />
                <div className='tab-border2' style={borderLeftStyle} />
                <div className='tab-border2' style={borderRightStyle} />
              </div>}
          </Motion>

          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              ref: 'page',
              getTab: self.getTab
            })
          })}
        </div>
      )
    } else {
      return null
    }
  }
}
