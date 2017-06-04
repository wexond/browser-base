import Tab from '../Tab'
import Transitions from '../../helpers/Transitions'

export default class Tabs {
  constructor () {
    const self = this
    
    // The timer for closing tabs system.
    this.timer = {
      canReset: false
    }
    this.dragData = {}

    this.elements = {}

    this.elements.tabs = div({ className: 'tabs' }, app.rootElement)

    this.elements.bottomBorder = div({ className: 'tabs-bottom-border' }, this.elements.tabs)

    this.elements.handle = div({ className: 'tabs-handle' }, this.elements.tabs)

    this.elements.tabbar = div({ className: 'tabbar' }, this.elements.tabs)

    this.elements.addButton = div({ className: 'tabs-add-button' }, this.elements.tabbar)
    this.elements.addButton.addEventListener('click', (e) => {
      self.addTab()
    })

    window.addEventListener('resize', (e) => {
      self.setWidths(false)
      self.setPositions(false, false)
    })

    this.addTab()

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

    window.addEventListener('mouseup', function () {
      if (self.dragData.tab != null && !self.dragData.tab.pinned) {
        self.dragData.canDrag = false
        self.dragData.canDrag2 = false

        self.elements.addButton.css('display', 'block')

        self.setPositions()

        if (window.tabs[window.tabs.indexOf(self.dragData.tab) - 1] != null) {
          window.tabs[window.tabs.indexOf(self.dragData.tab) - 1].elements.rightSmallBorder.css('display', 'none')
        }
        if (window.tabs[window.tabs.indexOf(self.dragData.tab) + 1] != null) {
          window.tabs[window.tabs.indexOf(self.dragData.tab) + 1].elements.leftSmallBorder.css('display', 'none')
        }
        for (var i = 0; i < window.tabs.length; i++) {
          window.tabs[i].elements.leftSmallBorder.css('display', 'none')
        }
        window.removeEventListener('mousemove', self.onMouseMove)
      }
    })
  }

  /** Events */

  /**
   * @event
   * @param {Event} e
   */
  onMouseMove = (e) => {
    let mouseDeltaX = e.pageX - this.dragData.mouseClickX
    const tab = this.dragData.tab
    const tabDiv = tab.elements.tab

    if (Math.abs(mouseDeltaX) > 10 || this.dragData.canDrag2) {
      this.dragData.canDrag2 = true

      if (this.dragData.canDrag && !this.dragData.tab.pinned && !this.dragData.tab.new) {
        tab.removeTransition('left')

        tab.setLeft(this.dragData.tabX + e.clientX - this.dragData.mouseClickX)

        if (tabDiv.getBoundingClientRect().left + tabDiv.offsetWidth > this.elements.tabbar.offsetWidth) {
          tab.setLeft(this.elements.tabbar.offsetWidth - tabDiv.offsetWidth)
        }
        if (tabDiv.getBoundingClientRect().left < this.elements.tabbar.getBoundingClientRect().left) {
          tab.setLeft(this.elements.tabbar.getBoundingClientRect().left)
        }

        this.dragData.tab.findTabToReplace(e.clientX)

        if (window.tabs.indexOf(this.dragData.tab) === window.tabs.length - 1) {
          this.elements.addButton.css('display', 'none')
        }

        if (window.tabs[window.tabs.indexOf(this.dragData.tab) - 1] != null) {
          window.tabs[window.tabs.indexOf(this.dragData.tab) - 1].elements.rightSmallBorder.css('display', 'block')
        }
        if (window.tabs[window.tabs.indexOf(this.dragData.tab) + 1] != null) {
          window.tabs[window.tabs.indexOf(this.dragData.tab) + 1].elements.leftSmallBorder.css('display', 'block')
        }
      }
    }
  }

  /**
   * Adds tab.
   * @param {Object} data 
   */
  addTab (data = window.defaultTabOptions) {
    let tab = new Tab(this)

    this.selectTab(tab)
  }

  /**
   * Selects given tab and deselects others.
   * @param {Tab} tab 
   */
  selectTab (tab) {
    for (var x = 0; x < window.tabs.length; x++) {
      if (window.tabs[x] !== tab) {
        window.tabs[x].deselect()
      }
    }
    tab.select()
  }

  /**
   * Gets widths for all tabs.
   * @return {Number}
   */
  getWidths () {
    let tabbarWidth = this.elements.tabbar.offsetWidth - this.elements.addButton.offsetWidth
    let tabWidth = (tabbarWidth / window.tabs.length)

    if (tabWidth > 190) {
      tabWidth = 190
    }

    return tabWidth
  }

  /**
   * Sets widths for all tabs.
   */
  setWidths (animation = true) {
    const width = this.getWidths()

    for (var x = 0; x < window.tabs.length; x++) {
      if (animation) {
        window.tabs[x].appendTransition('width')
      } else {
        window.tabs[x].removeTransition('width')
      }

      window.tabs[x].setWidth(width)
      window.tabs[x].width = width
    }
  }

  /**
   * Gets positions for all tabs.
   * @return {Object}
   */
  getPositions () {
    let positions = []
    let tempPosition = 0

    for (var x = 0; x < window.tabs.length; x++) {
      positions.push(tempPosition)
      tempPosition += window.tabs[x].width
    }

    let toReturn = {
      tabPositions: positions,
      addButtonPosition: tempPosition
    }

    return toReturn
  }

  /**
   * Sets positions for all tabs.
   */
  setPositions (animateTabs = true, animateAddButton = true) {
    const positions = this.getPositions()

    for (var x = 0; x < window.tabs.length; x++) {
      if (!window.tabs[x].blockLeftAnimation && animateTabs) {
        window.tabs[x].appendTransition('left')
      } else {
        window.tabs[x].removeTransition('left')
      }

      window.tabs[x].setLeft(positions.tabPositions[x])
    }

    this.setAddButtonAnimation(animateAddButton)
    this.elements.addButton.css('left', positions.addButtonPosition)
  } 

  /**
   * Sets add button animation.
   * @param {boolean} flag
   */
  setAddButtonAnimation = (flag) => {
    var transition = 'left ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    const addButton = this.elements.addButton

    if (addButton != null) {
      if (flag) {
        addButton.style['-webkit-transition'] = Transitions.appendTransition(addButton.style['-webkit-transition'], transition)
      } else {
        addButton.style['-webkit-transition'] = Transitions.removeTransition(addButton.style['-webkit-transition'], transition)
      }
    }
  }

  /**
   * Gets tab from mouse x point.
   * @param {Tab} callingTab
   * @param {number} cursorX
   * @return {Tab}
   */
  getTabFromMouseX = (callingTab, xPos) => {
    for (var i = 0; i < window.tabs.length; i++) {
      if (window.tabs[i] !== callingTab) {
        if (this.containsX(window.tabs[i], xPos)) {
          if (!window.tabs[i].locked) {
            return window.tabs[i]
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
    var rect = tabToCheck.elements.tab.getBoundingClientRect()

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
    for (var i = 0; i < window.tabs.length; i++) {
      if (window.tabs[i] !== callingTab) {
        if (this.containsPoint(window.tabs[i], xPos, yPos)) {
          if (!window.tabs[i].locked) {
            return window.tabs[i]
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
    var rect = tabToCheck.elements.tab.getBoundingClientRect()

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
    var firstTab = window.tabs[firstIndex]
    var secondTab = window.tabs[secondIndex]

    // Replace tabs in array.
    window.tabs[firstIndex] = secondTab
    window.tabs[secondIndex] = firstTab

    // Show or hide borders.
    if (window.tabs.indexOf(firstTab) === 0) {
      firstTab.elements.leftSmallBorder.css('display', 'none')
    } else {
      firstTab.elements.leftSmallBorder.css('display', 'block')
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
    for (var i = 0; i < window.tabs.length; i++) {
      if (!window.tabs[i].selected) {
        window.tabs[i].elements.rightSmallBorder.css('display', 'block')
      }
    }

    for (i = 0; i < window.tabs.length; i++) {
      window.tabs[i].elements.leftSmallBorder.css('display', 'none')
    }

    let tab = this.getSelectedTab()

    let prevTab = window.tabs[window.tabs.indexOf(tab) - 1]

    if (prevTab != null) {
      prevTab.elements.rightSmallBorder.css('display', 'none')
    }
  }

  /**
   * Gets selected tab.
   * @return {Tab}
   */
  getSelectedTab = () => {
    for (var i = 0; i < window.tabs.length; i++) {
      if (window.tabs[i].selected) {
        return window.tabs[i]
      }
    }
    return null
  }
}