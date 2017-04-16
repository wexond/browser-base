import React from 'react'
import Tab from './components/Tab'
import Controls from './components/Controls'

import {Motion, spring} from 'react-motion'

export default class Tabs extends React.Component {
  constructor () {
    super()

    this.state = {
      tabsToCreate: [],
      addButtonLeft: 0,
      addButtonVisible: true,
      borderColor: 'rgba(0,0,0,0.12)',
      backgroundColor: '#EEE',
      tabsVisible: false
    }

    // The timer for closing tabs system.
    this.timer = {
      canReset: false
    }

    this.dragData = {}

    this.canShowAddButton = false
  }

  componentDidMount () {
    const self = this
    // Add tab after 1 millisecond to fix problem with measurements.
    setTimeout(this.addTab, 1)

    // Start the timer.
    this.timer.timer = setInterval(function () { // Invoke the function each 3 seconds.
      if (self.timer.canReset && self.timer.time === 3) { // If can calculate widths for all tabs.
        // Calculate widths and positions for all tabs.
        self.setWidths()
        self.setPositions()

        self.timer.canReset = false
      }
      self.timer.time += 1
    }, 1000)

    /** Events */

    window.addEventListener('resize', function () {
      self.setWidths(false)
      self.setPositions(false, false)
    })

    window.addEventListener('mouseup', function () {
      if (self.dragData.tab != null && !self.dragData.tab.pinned && !self.dragData.tab.new) {
        self.dragData.canDrag = false

        self.dragData.canDrag2 = false

        if (self.canShowAddButton) {
          self.setState({addButtonVisible: true})
        }

        self.setPositions()

        if (global.tabs[global.tabs.indexOf(self.dragData.tab) - 1] != null) {
          global.tabs[global.tabs.indexOf(self.dragData.tab) - 1].setState({smallBorderVisible: false})
        }
        if (global.tabs[global.tabs.indexOf(self.dragData.tab) + 1] != null) {
          global.tabs[global.tabs.indexOf(self.dragData.tab) + 1].setState({leftSmallBorderVisible: false})
        }
        for (var i = 0; i < global.tabs.length; i++) {
          global.tabs[i].setState({leftSmallBorderVisible: false})
        }
        window.removeEventListener('mousemove', self.onMouseMove)
      }
    })
  }

  /** events */

  /**
   * @event
   * @param {Event} e
   */
  onMouseMove = (e) => {
    var mouseDeltaX = e.pageX - this.dragData.mouseClickX

    if (Math.abs(mouseDeltaX) > 10 || this.dragData.canDrag2) {
      this.dragData.canDrag2 = true
      if (this.dragData.canDrag && !this.dragData.tab.pinned && !this.dragData.tab.new) {
        this.dragData.tab.setState({
          left: this.dragData.tabX + e.clientX - this.dragData.mouseClickX
        })

        this.dragData.tab.reorderTabs(e.clientX)

        if (global.tabs.indexOf(this.dragData.tab) === global.tabs.length - 1) {
          this.setState({addButtonVisible: false})
        }

        if (global.tabs[global.tabs.indexOf(this.dragData.tab) - 1] != null) {
          global.tabs[global.tabs.indexOf(this.dragData.tab) - 1].setState({smallBorderVisible: true})
        }
        if (global.tabs[global.tabs.indexOf(this.dragData.tab) + 1] != null) {
          global.tabs[global.tabs.indexOf(this.dragData.tab) + 1].setState({leftSmallBorderVisible: true})
        }
      }
    }
  }

  /**
   * Closes given tab.
   * @param {Tab} tab
   */
  closeTab = (tab) => {
    const self = this
    // If the tab is last tab.
    if (global.tabs.length === 1) {
      this.setState({tabsVisible: false})
      this.addTab()
    }

    if (global.tabs.length === 2) {
      if (!tab.new) {
        for (var i = 0; i < global.tabs.length; i++) {
          if (global.tabs[i].new) {
            global.tabs[i].getPage().setState({height: '100vh'})
            this.setState({tabsVisible: false})
          }
        }
      }
    }

    this.timer.canReset = true
    // Remove page associated to the tab.
    tab.getPage().setState({render: false})

    // Get previous and next tab.
    var index = global.tabs.indexOf(tab)
    var nextTab = global.tabs[index + 1]
    var prevTab = global.tabs[index - 1]

    // Remove the tab from array.
    global.tabs.splice(index, 1)

    if (tab.selected) {
      if (nextTab != null) { // If the next tab exists, select it.
        this.selectTab(nextTab)
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          this.selectTab(prevTab)
        } else { // If the previous tab not exists, check if the first tab exists.
          if (global.tabs[0] != null) { // If first tab exists, select it.
            this.selectTab(global.tabs[0])
          }
        }
      }
    }

    // Bring back the add tab button.
    this.setState({addButtonVisible: true})

    if (index === global.tabs.length) { // If the tab is last.
      // Calculate all widths and positions for all tabs.
      this.setWidths()
      this.setPositions()

      if (tab.width < 190) { // If tab width is less than normal tab width.
        tab.setState({render: false}) // Just remove it.
      } else {
        closeAnim() // Otherwise, animate the tab.
      }
    } else {
      closeAnim() // Otherwise, animate the tab.
    }

    // Animate tab closing.
    function closeAnim () {
      tab.hiding = true
      // Animate.
      tab.setState({
        width: spring(0, global.tabsAnimationData.closeTabSpring),
        visible: false
      })
    }

    self.timer.time = 0

    // Calculate positions for all tabs, but don't calculate widths.
    this.setPositions()
  }

  /**
   * Helper method.
   * Deselects other tabs and selects given tab.
   * @param {Tab} tab
   */
  selectTab = (tab) => {
    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i] === tab) {
        tab.select()
      } else {
        global.tabs[i].deselect()
      }
    }
  }

  /**
   * Adds new tab to <Tabs> component.
   * @param {object} options - data to pass to new tab.
   */
  addTab = (options = global.defaultOptions) => {
    this.setState(previousState => ({
      tabsToCreate: [...previousState.tabsToCreate, options]
    }))
  }

  /**
   * Sets positions for tabs and add button.
   * @param {boolean} animateTabs
   * @param {boolean} animateAddButton
   */
  setPositions = (animateTabs = true, animateAddButton = true) => {
    var data = this.getPositions()
    var lefts = data.tabPositions
    var addLeft = data.addButtonPosition

    for (var i = 0; i < global.tabs.length; i++) {
      if (animateTabs) {
        global.tabs[i].setState({
          left: spring(lefts[i], global.tabsAnimationData.setPositionsSpring)
        })
      } else {
        global.tabs[i].setState({
          left: lefts[i]
        })
      }
    }

    if (animateAddButton) {
      this.setState({
        addButtonLeft: spring(addLeft, global.tabsAnimationData.setPositionsSpring)
      })
    } else {
      this.setState({
        addButtonLeft: addLeft
      })
    }

    this.updateTabs()
  }

  /**
   * Sets widths for all tabs.
   * @param {boolean} animation
   */
  setWidths = (animation = true) => {
    var widths = this.getWidths()

    for (var i = 0; i < global.tabs.length; i++) {
      if (animation) {
        global.tabs[i].setState({
          width: spring(widths[i], global.tabsAnimationData.setWidthsSpring)
        })
      } else {
        global.tabs[i].setState({width: widths[i]})
      }

      global.tabs[i].width = widths[i]
    }

    this.updateTabs()
  }

  /**
   * Calculates positions for all tabs and add button.
   * @return {object}
   */
  getPositions = () => {
    var lefts = []
    var a = 0

    for (var i = 0; i < global.tabs.length; i++) {
      lefts.push(a)
      if (!global.tabs[i].new) {
        a += global.tabs[i].width
      }
    }

    return {tabPositions: lefts, addButtonPosition: a}
  }

  /**
   * Calculates widths for tabs.
   * @return {number}
   */
  getWidths = (margin = 0) => {
    var tabsWidth = this.refs.tabbar.offsetWidth
    var addButtonWidth = this.addButton.offsetWidth
    var tabWidthsTemp = []
    var tabWidths = []
    var pinnedTabsLength = 0
    var newTabsLength = 0

    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i].pinned) {
        tabWidthsTemp.push({id: i, width: global.tabsData.pinnedTabWidth})
        pinnedTabsLength += 1
      }
      if (global.tabs[i].new) {
        tabWidthsTemp.push({id: i, width: global.tabsData.newTabWidth})
        newTabsLength += 1
      }
    }

    for (i = 0; i < global.tabs.length; i++) {
      if (!global.tabs[i].pinned && !global.tabs[i].new) {
        var margins = global.tabs.length * margin
        var smallTabsWidth = (pinnedTabsLength * global.tabsData.pinnedTabWidth) + (newTabsLength * global.tabsData.newTabWidth)
        var tabWidthTemp = (tabsWidth - addButtonWidth - margins - smallTabsWidth) / (global.tabs.length - (pinnedTabsLength + newTabsLength))
        if (tabWidthTemp > global.tabsData.maxTabWidth) {
          tabWidthTemp = global.tabsData.maxTabWidth
        }
        tabWidthsTemp.push({id: i, width: tabWidthTemp})
      }
    }

    for (i = 0; i < tabWidthsTemp.length; i++) {
      tabWidths[tabWidthsTemp[i].id] = tabWidthsTemp[i].width
    }

    return tabWidths
  }

  /**
   * Gets tab from mouse point.
   * @param {Tab} callingTab
   * @param {number} cursorX
   * @return {Tab}
   */
  getTabFromMousePoint = (callingTab, xPos) => {
    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i] !== callingTab) {
        if (this.contains(global.tabs[i], xPos)) {
          if (!global.tabs[i].locked) {
            return global.tabs[i]
          }
        }
      }
    }
    return null
  }

  /**
   * Checks if {Tab} contains mouse x position
   * @param {Tab} tabToCheck
   * @param {number} cursorX
   * @return {Boolean}
   */
  contains = (tabToCheck, xPos) => {
    var rect = tabToCheck.tab.getBoundingClientRect()

    if (xPos >= rect.left && xPos <= rect.right) {
      return true
    }
    return false
  }

  /**
   * Replaces tabs.
   * @param {number} firstIndex
   * @param {number} secondIndex
   * @param {boolean} changePos
   */
  replaceTabs = (firstIndex, secondIndex, changePos = true) => {
    var firstTab = global.tabs[firstIndex]
    var secondTab = global.tabs[secondIndex]

    // Replace tabs in array.
    global.tabs[firstIndex] = secondTab
    global.tabs[secondIndex] = firstTab

    // Show or hide borders.
    if (global.tabs.indexOf(firstTab) === 0) {
      firstTab.setState({leftBorderVisible: false})
    } else {
      firstTab.setState({leftBorderVisible: true})
    }

    // Change positions of replaced tabs.
    if (changePos) {
      secondTab.updatePosition()
    }
  }

  /**
   * Updates tabs' state (borders etc).
   */
  updateTabs = () => {
    for (var i = 0; i < global.tabs.length; i++) {
      if (!global.tabs[i].selected) {
        global.tabs[i].setState({smallBorderVisible: true})
      }
    }

    for (i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i].selected) {
        if (global.tabs[i - 1] != null) {
          global.tabs[i - 1].setState({smallBorderVisible: false})
        }
      }
    }

    for (i = 0; i < global.tabs.length; i++) {
      global.tabs[i].setState({leftSmallBorderVisible: false})
    }
  }

  /**
   * Gets controls.
   * @return {Controls}
   */
  getControls = () => {
    return this.refs.controls
  }

  /**
   * Gets tabs container {Tabs}
   * @return {Tabs}
   */
  getTabs = () => {
    return this
  }

  render () {
    const self = this

    var systembarBorderStyle = {
      backgroundColor: this.state.borderColor
    }

    var tabsDisplay = (this.state.tabsVisible) ? 'block' : 'none'

    var systembarStyle = {
      backgroundColor: this.state.backgroundColor,
      display: tabsDisplay
    }

    /** events */

    function onAddButtonClick () {
      self.addTab()
    }

    return (
      <div>
        <div className='systembar' style={systembarStyle}>
          <div className='systembar-drag-handle' />
          <div className='tabbar' ref='tabbar'>
            {this.state.tabsToCreate.map((data, key) => {
              return (
                <Tab url={data.url} getApp={self.props.getApp} getTabs={self.getTabs} select={data.select} key={key} />
              )
            })}
            <Motion style={{left: this.state.addButtonLeft}}>
              {value =>
                <div ref={(a) => { this.addButton = a }}
                  style={{
                    left: value.left,
                    display: (this.state.addButtonVisible && this.state.tabsVisible) ? 'block' : 'none'
                  }}
                  onClick={onAddButtonClick}
                  className='add-button' />}
            </Motion>
          </div>
          <Controls ref='controls' />
          <div className='systembar-border' style={systembarBorderStyle} />
        </div>
      </div>
    )
  }
}
