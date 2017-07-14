import Component from '../../component'
import UI from '../../ui'
import Store from '../../store'

import Transitions from '../../utils/Transitions'
import Colors from '../../utils/colors'

import tabsDefaults from '../../defaults/tabs'

import { getCurrentWindow } from '../../actions/window'
import { getTabFromMousePoint, findTabToReplace } from '../../actions/tabs'

import Tab from '../Tab'
import WindowControls from '../WindowControls'

export default class Tabs extends Component {
  beforeRender () {
    // The timer for closing tabs system.
    this.timer = {
      canReset: false
    }
    this.cursor = {}
    this.dragData = {}
  }

  render () {
    return (
      <div className='tabs' ref='tabs'>
        <div className='tabs-bottom-border' ref='bottomBorder' />
        <div className='tabs-handle' ref='handle' />
        <WindowControls />
        <div ref='controlsBorder' className='tabs-border-vertical' />
        <div className='tabbar' ref='tabbar'>
        </div>
        <div className='tabs-add-button' ref='addButton' />
      </div>
    )
  }

  afterRender () {
    const self = this

    this.elements.addButton.addEventListener('click', (e) => {
      self.addTab()
    })

    window.addEventListener('resize', (e) => {
      if (e.isTrusted) {
        self.setWidths(false)
        self.setPositions(false, false)
      }
    })

    getCurrentWindow().on('maximize', (e) => {
      self.elements.handle.setCSS({
        left: 0,
        top: 0,
        right: 0,
        height: '100%'
      })
    })

    getCurrentWindow().on('unmaximize', (e) => {
      self.elements.handle.setCSS({
        left: 4,
        top: 4,
        right: 4,
        height: 'calc(100% - 4px)'
      })
    })
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

    // Fixes #1 issue.
    // Custom mouseenter and mouseleave event.
    let previousTab = null
    setInterval(function () {
      let tab = getTabFromMousePoint(null)

      // Mouse leave.
      if (previousTab !== null && previousTab !== tab) {
        if (previousTab.hovered) {
          previousTab.hovered = false
          if (!previousTab.selected) {
            previousTab.appendTransition('background-color')
            previousTab.elements.tab.setCSS({
              backgroundColor: 'transparent'
            })
            previousTab.elements.close.setCSS({
              opacity: 0,
              transition: '0.2s opacity'
            })
            previousTab.setTitleMaxWidth(false)
          }
        }
      }

      // Mouse enter.
      if (tab != null) {
        if (!tab.hovered) {
          tab.hovered = true
          previousTab = tab
          if (!tab.selected) {
            let rgba = Colors.shadeColor(Colors.rgbToHex(self.elements.tabs.getCSS('background-color')), 0.05)
            tab.appendTransition('background-color')

            tab.elements.tab.setCSS({
              backgroundColor: rgba
            })

            tab.timeoutHover = setTimeout(function () {
              clearTimeout(tab.timeoutHover)
              tab.removeTransition('background-color')
            }, tabsDefaults.transitions['background-color'].duration * 1000)

            tab.setTitleMaxWidth(true)

            if (!tab.pinned) {
              tab.elements.close.setCSS({
                opacity: 1,
                transition: '0.2s opacity'
              })
            }
          }
        }
      }
    }, 1)

    window.addEventListener('mouseup', function () {
      if (self.dragData.tab != null && !self.dragData.tab.pinned) {
        self.dragData.canDrag = false
        self.dragData.canDrag2 = false

        self.elements.addButton.setCSS({visibility: 'visible'})

        self.setPositions()

        if (Store.tabs[Store.tabs.indexOf(self.dragData.tab) - 1] != null) {
          Store.tabs[Store.tabs.indexOf(self.dragData.tab) - 1].elements.rightSmallBorder.setCSS({display: 'none'})
        }
        if (Store.tabs[Store.tabs.indexOf(self.dragData.tab) + 1] != null) {
          Store.tabs[Store.tabs.indexOf(self.dragData.tab) + 1].elements.leftSmallBorder.setCSS({display: 'none'})
        }
        for (var i = 0; i < Store.tabs.length; i++) {
          Store.tabs[i].elements.leftSmallBorder.setCSS({display: 'none'})
        }
        removeEventListener('mousemove', self.onMouseMove)
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

        findTabToReplace(this.dragData.tab, e.clientX)

        if (Store.tabs.indexOf(this.dragData.tab) === Store.tabs.length - 1) {
          this.elements.addButton.setCSS({visibility: 'hidden'})
        }

        if (Store.tabs[Store.tabs.indexOf(this.dragData.tab) - 1] != null) {
          Store.tabs[Store.tabs.indexOf(this.dragData.tab) - 1].elements.rightSmallBorder.setCSS({display: 'block'})
        }
        if (Store.tabs[Store.tabs.indexOf(this.dragData.tab) + 1] != null) {
          Store.tabs[Store.tabs.indexOf(this.dragData.tab) + 1].elements.leftSmallBorder.setCSS({display: 'block'})
        }
      }
    }
  }

  /**
   * Adds tab.
   * @param {Object} data
   */
  addTab (data = tabsDefaults.defaultOptions) {
    UI.render(<Tab select={data.select} url={data.url} tabs={this}/>, this.elements.tabbar, this)
  }

  /**
   * Selects given tab and deselects others.
   * @param {Tab} tab
   */
  selectTab (tabToSelect) {
    Store.tabs.forEach((tab) => {
      if (tab !== tabToSelect) {
        tab.deselect()
      }
    })
    this.selectedTab = tabToSelect
    tabToSelect.select()
  }

  /**
   * Gets widths for all tabs.
   * @param {Number} margin
   * @return {Number}
   */
  getWidths (margin = 0) {
    const tabbarWidth = this.elements.tabbar.offsetWidth
    const addButtonWidth = this.elements.addButton.offsetWidth
    let tabWidths = []
    let pinnedTabsLength = 0

    for (var i = 0; i < Store.tabs.length; i++) {
      if (Store.tabs[i].pinned) {
        // Push width for pinned tab.
        tabWidths.push(tabsDefaults.pinnedTabWidth)

        pinnedTabsLength += 1
      }
    }

    for (i = 0; i < Store.tabs.length; i++) {
      if (!Store.tabs[i].pinned) {
        // Include margins between tabs.
        var margins = Store.tabs.length * margin
        // Include pinned tabs.
        var smallTabsWidth = (pinnedTabsLength * tabsDefaults.pinnedTabWidth)
        // Calculate final width per tab.
        var tabWidthTemp = (tabbarWidth - addButtonWidth - margins - smallTabsWidth) / (Store.tabs.length - pinnedTabsLength)
        // Check if tab's width isn't greater than max tab width.
        if (tabWidthTemp > tabsDefaults.maxTabWidth) {
          tabWidthTemp = tabsDefaults.maxTabWidth
        }
        // Push width for normal tab.
        tabWidths.push(tabWidthTemp)
      }
    }

    return tabWidths
  }

  /**
   * Sets widths for all tabs.
   */
  setWidths (animation = true) {
    const widths = this.getWidths()
    let normalTabWidth = tabsDefaults.maxTabWidth

    Store.tabs.forEach((tab, index) => {
      let tabSelected = tab.selected
      let width = widths[index]
      let widthSmaller = width < 48

      if (animation) {
        tab.appendTransition('width')
      } else {
        tab.removeTransition('width')
      }

      tab.setWidth(width)

      if (!tab.pinned) normalTabWidth = width

      let showClose = true
      if ((!tabSelected && widthSmaller) || tab.pinned) {
        showClose = false
      }

      tab.elements.close.style.display = (showClose) ? 'block' : 'none'

      let displayIcon = (tab.pinned) ? 'block' : ((tabSelected) ? ((widthSmaller) ? 'none' : 'block') : 'block')
      tab.elements.icon.style.display = displayIcon
    })

    if (normalTabWidth < tabsDefaults.maxTabWidth) {
      this.elements.controlsBorder.style.display = 'block'
    } else {
      this.elements.controlsBorder.style.display = 'none'
    }
  }

  /**
   * Gets positions for all tabs.
   * @return {Object}
   */
  getPositions () {
    let positions = []
    let tempPosition = 0

    Store.tabs.forEach((tab) => {
      positions.push(tempPosition)
      tempPosition += tab.width
    })

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

    Store.tabs.forEach((tab) => {
      if (!tab.blockLeftAnimation && animateTabs) {
        tab.appendTransition('left')
      } else {
        tab.removeTransition('left')
      }
      tab.setLeft(positions.tabPositions[Store.tabs.indexOf(tab)])
    })

    this.setAddButtonAnimation(animateAddButton)
    this.elements.addButton.setCSS({
      left: positions.addButtonPosition
    })
  }

  /**
   * Sets add button animation.
   * @param {boolean} flag
   */
  setAddButtonAnimation (flag) {
    if (flag) {
      if (this.isAddButtonTransitionToggled) return // If the transition already exists.
    } else {
      if (!this.isAddButtonTransitionToggled) return // If the transition don't exist.
    }

    const transitionData = tabsDefaults.transitions.left
    let transition = 'left ' + transitionData.duration + 's ' + transitionData.easing
    const addButton = this.elements.addButton

    if (addButton != null) {
      if (flag) {
        let newTransition = Transitions.appendTransition(addButton.getCSS('-webkit-transition'), transition)
        addButton.style['-webkit-transition'] = newTransition
        this.isAddButtonTransitionToggled = true
      } else {
        let newTransition = Transitions.removeTransition(addButton.getCSS('-webkit-transition'), transition)
        addButton.style['-webkit-transition'] = newTransition
        this.isAddButtonTransitionToggled = false
      }
    }
  }
}
