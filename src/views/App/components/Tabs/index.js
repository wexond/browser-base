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
    const self = this

    setTimeout(function () {
      self.getPositions(function (data) {
        const lefts = data.tabPositions
        const addLeft = data.addButtonPosition

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
          self.setState({
            addButtonLeft: spring(addLeft, global.tabsAnimationData.setPositionsSpring)
          })
        } else {
          self.setState({
            addButtonLeft: addLeft
          })
        }

        self.updateTabs()
      })
    }, 0)
  }

  /**
   * Sets widths for all tabs.
   * @param {boolean} animation
   */
  setWidths = (animation = true) => {
    const self = this

    setTimeout(function () {
      self.getWidths(function (widths) {
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

        self.updateTabs()
      })
    }, 0)
  }

  /**
   * Calculates positions for all tabs and add button.
   * @param {function} callback
   */
  getPositions = (callback = null) => {
    setTimeout(function () {
      let lefts = []
      let a = 0

      for (var i = 0; i < global.tabs.length; i++) {
        lefts.push(a)
        a += global.tabs[i].width
      }

      const callbackData = {tabPositions: lefts, addButtonPosition: a}

      if (callback != null) callback(callbackData)
    }, 0)
  }

  /**
   * Calculates widths for tabs.
   * @param {function} callback
   * @param {number} margin - the margin between tabs
   */
  getWidths = (callback = null, margin = 0) => {
    const self = this

    setTimeout(function () {
      const tabbarWidth = self.refs.tabbar.offsetWidth
      const addButtonWidth = self.addButton.offsetWidth
      let tabWidthsTemp = []
      let tabWidths = []
      let pinnedTabsLength = 0

      for (var i = 0; i < global.tabs.length; i++) {
        if (global.tabs[i].pinned) {
          // Push width for pinned tab.
          tabWidthsTemp.push({id: i, width: global.tabsData.pinnedTabWidth})

          pinnedTabsLength += 1
        }
      }

      for (i = 0; i < global.tabs.length; i++) {
        if (!global.tabs[i].pinned) {
          // Include margins between tabs.
          var margins = global.tabs.length * margin
          // Include pinned tabs.
          var smallTabsWidth = (pinnedTabsLength * global.tabsData.pinnedTabWidth)
          // Calculate final width per tab.
          var tabWidthTemp = (tabbarWidth - addButtonWidth - margins - smallTabsWidth) / (global.tabs.length - pinnedTabsLength)
          // Check if tab's width isn't greater than max tab width.
          if (tabWidthTemp > global.tabsData.maxTabWidth) {
            tabWidthTemp = global.tabsData.maxTabWidth
          }
          // Push width for normal tab.
          tabWidthsTemp.push({id: i, width: tabWidthTemp})
        }
      }

      for (i = 0; i < tabWidthsTemp.length; i++) {
        tabWidths[tabWidthsTemp[i].id] = tabWidthsTemp[i].width
      }

      if (callback != null) callback(tabWidths)
    }, 0)
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
        {(!this.state.tabsVisible) ? <div className='systembar-drag-handle' /> : null}
        <div className='systembar' style={systembarStyle}>
          {(this.state.tabsVisible) ? <div className='systembar-drag-handle' /> : null}
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
          <div className='systembar-border' style={systembarBorderStyle} />
        </div>
        <Controls ref='controls' />
      </div>
    )
  }
}
