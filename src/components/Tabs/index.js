import Tab from '../Tab'
import Transitions from '../../helpers/Transitions'

export default class Tabs {
  constructor () {
    const self = this
    
    // The timer for closing tabs system.
    this.timer = {
      canReset: false
    }

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
}