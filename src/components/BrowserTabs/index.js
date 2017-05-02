import React from 'react'
import BrowserTab from '../BrowserTab'
import Controls from '../Controls'
import Colors from '../../helpers/Colors'
import Transitions from '../../helpers/Transitions'

export default class BrowserTabs extends React.Component {
  constructor () {
    super()

    this.state = {
      tabsToCreate: [],
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

    this.cursor = {}
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

        self.setState({addButtonVisible: true})

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

    window.addEventListener('mousemove', function (e) {
      self.cursor.x = e.pageX
      self.cursor.y = e.pageY
      self.props.getApp().cursor.x = e.pageX
      self.props.getApp().cursor.y = e.pageY
    })

    // Fixes #1 issue.
    // Custom mouseenter and mouseleave event.
    var previousTab = null
    setInterval(function () {
      let tab = self.getTabFromMousePoint(null, self.cursor.x, self.cursor.y)

      // Mouse leave.
      if (previousTab !== null && previousTab !== tab) {
        if (previousTab.hovered) {
          previousTab.hovered = false
          if (!previousTab.selected) {
            previousTab.appendTransition('background-color')
            previousTab.setState(
              {
                backgroundColor: 'transparent',
                closeOpacity: {
                  value: 0,
                  animate: true
                },
                faviconVisible: true
              }
            )
          }
        }
      }

      // Mouse enter.
      if (tab != null) {
        if (!tab.hovered) {
          tab.hovered = true
          previousTab = tab
          if (!tab.selected) {
            if (tab.refs.tab.offsetWidth < 48) {
              if (tab.state.favicon !== '') {
                tab.setState({faviconVisible: false})
              }
            }
            let rgba = Colors.shadeColor(self.state.backgroundColor, 0.05)
            tab.appendTransition('background-color')
            tab.setState(
              {
                backgroundColor: rgba
              }
            )

            tab.timeoutHover = setTimeout(function () {
              clearTimeout(tab.timeoutHover)
              tab.removeTransition('background-color')
            }, global.tabsAnimationData.hoverDuration * 1000)

            if (!tab.pinned) {
              tab.setState({closeOpacity: {value: 1, animate: true}})
            }
          }
        }
      }
    }, 1)
  }

  /** events */

  /**
   * @event
   * @param {Event} e
   */
  onMouseMove = (e) => {
    let mouseDeltaX = e.pageX - this.dragData.mouseClickX
    const tab = this.dragData.tab
    const tabDiv = tab.refs.tab

    if (Math.abs(mouseDeltaX) > 10 || this.dragData.canDrag2) {
      this.dragData.canDrag2 = true

      if (this.dragData.canDrag && !this.dragData.tab.pinned && !this.dragData.tab.new) {
        tab.removeTransition('left')

        tab.setLeft(this.dragData.tabX + e.clientX - this.dragData.mouseClickX)

        if (tabDiv.getBoundingClientRect().left + tabDiv.offsetWidth > this.refs.tabbar.offsetWidth) {
          tab.setLeft(this.refs.tabbar.offsetWidth - tabDiv.offsetWidth)
        }
        if (tabDiv.getBoundingClientRect().left < this.refs.tabbar.getBoundingClientRect().left) {
          tab.setLeft(this.refs.tabbar.getBoundingClientRect().left)
        }

        this.dragData.tab.findTabToReplace(e.clientX)

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

    self.getPositions(function (data) {
      const lefts = data.tabPositions
      const addLeft = data.addButtonPosition

      for (var i = 0; i < global.tabs.length; i++) {
        // React's setState lowers performance :(
        // Need to access DOM directly
        var tab = global.tabs[i].refs.tab

        if (!global.tabs[i].blockLeftAnimation && animateTabs) {
          global.tabs[i].appendTransition('left')
        } else {
          global.tabs[i].removeTransition('left')
        }

        tab.style.left = lefts[i] + 'px'
      }

      self.setAddButtonAnimation(animateAddButton)
      self.refs.addButton.style.left = addLeft + 'px'
    })
  }

  /**
   * Sets widths for all tabs.
   * @param {boolean} animation
   */
  setWidths = (animation = true) => {
    const self = this

    self.getWidths(function (widths) {
      for (var i = 0; i < global.tabs.length; i++) {
        // React's setState lowers performance :(
        // Need to access DOM directly
        var tab = global.tabs[i].refs.tab
        tab.style.width = widths[i] + 'px'

        if (animation) {
          global.tabs[i].appendTransition('width')
        } else {
          global.tabs[i].removeTransition('width')
        }

        global.tabs[i].width = widths[i]
      }
    })
  }

  /**
   * Calculates positions for all tabs and add button.
   * @param {function} callback
   */
  getPositions = (callback = null) => {
    let lefts = []
    let a = 0

    for (var i = 0; i < global.tabs.length; i++) {
      lefts.push(a)
      a += global.tabs[i].width
    }

    const callbackData = {tabPositions: lefts, addButtonPosition: a}

    if (callback != null) callback(callbackData)
  }

  /**
   * Calculates widths for tabs.
   * @param {function} callback
   * @param {number} margin - the margin between tabs
   */
  getWidths = (callback = null, margin = 0) => {
    const self = this

    const tabbarWidth = self.refs.tabbar.offsetWidth
    const addButtonWidth = self.refs.addButton.offsetWidth
    let tabWidths = []
    let pinnedTabsLength = 0

    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i].pinned) {
        // Push width for pinned tab.
        tabWidths.push(global.tabsData.pinnedTabWidth)

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
        tabWidths.push(tabWidthTemp)
      }
    }

    if (callback != null) callback(tabWidths)
  }

  /**
   * Gets tab from mouse x point.
   * @param {Tab} callingTab
   * @param {number} cursorX
   * @return {Tab}
   */
  getTabFromMouseX = (callingTab, xPos) => {
    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i] !== callingTab) {
        if (this.containsX(global.tabs[i], xPos)) {
          if (!global.tabs[i].locked) {
            return global.tabs[i]
          }
        }
      }
    }
    return null
  }

  /**
   * Checks if {Tab} contains mouse x position.
   * @param {Tab} tabToCheck
   * @param {number} xPos
   * @return {boolean}
   */
  containsX = (tabToCheck, xPos) => {
    var rect = tabToCheck.refs.tab.getBoundingClientRect()

    if (xPos >= rect.left && xPos <= rect.right) {
      return true
    }

    return false
  }

  /**
   * Gets tab from mouse x and y point.
   * @param {Tab} callingTab
   * @param {number} cursorX
   * @param {number} cursorY
   * @return {Tab}
   */
  getTabFromMousePoint = (callingTab, xPos, yPos) => {
    for (var i = 0; i < global.tabs.length; i++) {
      if (global.tabs[i] !== callingTab) {
        if (this.containsPoint(global.tabs[i], xPos, yPos)) {
          if (!global.tabs[i].locked) {
            return global.tabs[i]
          }
        }
      }
    }
    return null
  }

  /**
   * Checks if {Tab} contains mouse x and y position.
   * @param {Tab} tabToCheck
   * @param {number} xPos
   * @param {number} yPos
   * @return {boolean}
   */
  containsPoint = (tabToCheck, xPos, yPos) => {
    var rect = tabToCheck.refs.tab.getBoundingClientRect()

    if (xPos >= rect.left && xPos <= rect.right && yPos <= rect.bottom) {
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
   * Sets add button animation.
   * @param {boolean} flag
   */
  setAddButtonAnimation = (flag) => {
    var transition = 'left ' + global.tabsAnimationData.positioningDuration + 's ' + global.tabsAnimationData.positioningEasing
    const addButton = this.refs.addButton

    if (addButton != null) {
      if (flag) {
        addButton.style['-webkit-transition'] = Transitions.appendTransition(addButton.style['-webkit-transition'], transition)
      } else {
        addButton.style['-webkit-transition'] = Transitions.removeTransition(addButton.style['-webkit-transition'], transition)
      }
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

    let systembarBorderStyle = {
      backgroundColor: this.state.borderColor
    }

    let tabsDisplay = (this.state.tabsVisible) ? 'block' : 'none'

    let systembarStyle = {
      backgroundColor: this.state.backgroundColor,
      display: tabsDisplay
    }

    let addButtonStyle = {
      display: (this.state.addButtonVisible) ? 'block' : 'none'
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
                <BrowserTab url={data.url} getApp={self.props.getApp} getTabs={self.getTabs} select={data.select} key={key} />
              )
            })}
            <div ref='addButton' style={addButtonStyle} onClick={onAddButtonClick} className='add-button' />
          </div>
          <div className='systembar-border' style={systembarBorderStyle} />
        </div>
        <Controls ref='controls' />
      </div>
    )
  }
}
