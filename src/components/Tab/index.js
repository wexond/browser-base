import Page from '../Page'
import Transitions from '../../helpers/Transitions'

export default class Tab {
  constructor (tabs) {
    const self = this

    this.tabs = tabs
    this.elements = {}

    this.page = new Page(this)

    this.elements.tab = div({ className: 'tab' }, tabs.elements.tabbar)
    this.elements.tab.addEventListener('mousedown', (e) => {
      tabs.selectTab(self)
    })

    this.elements.content = div({ className: 'tab-content' }, this.elements.tab)

    this.elements.title = div({
      className: 'tab-title',
      innerHTML: 'New tab'
    }, this.elements.content)

    this.elements.close = div({ className: 'tab-close' }, this.elements.content)
    this.elements.close.addEventListener('click', (e) => {
      self.close()
    })

    this.elements.rightSmallBorder = div({ className: 'tab-border-small-vertical' }, this.elements.tab)
    this.elements.rightSmallBorder.css('right', -1)

    this.elements.rightFullBorder = div({ className: 'tab-border-full-vertical' }, this.elements.tab)
    this.elements.rightFullBorder.css({
      right: 0,
      display: 'none'
    })
    
    window.tabs.push(this)

    this.blockLeftAnimation = true

    let position = this.tabs.getPositions().tabPositions[window.tabs.indexOf(this)]
    this.setLeft(position)

    this.appendTransition('width')
    
    setTimeout(() => {
      self.blockLeftAnimation = false

      self.tabs.setWidths()
      self.tabs.setPositions()
    }, 1)
  }

  /** 
   * Sets width of tab div.
   * @param {Number} width
   */
  setWidth (width) {
    this.elements.tab.css('width', width)
  }

  /** 
   * Sets left of tab div.
   * @param {Number} left
   */
  setLeft (left) {
    this.elements.tab.css('left', left)
  }

  /** 
   * Selects tab.
   */
  select () {
    this.elements.tab.css('background-color', '#fff')
    this.page.show()

    this.elements.rightSmallBorder.css('display', 'none')
    this.elements.rightFullBorder.css('display', 'block')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]

    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'none')
      previousTab.elements.rightFullBorder.css({ display: 'block' })
    }

    this.selected = true
  }

  /** 
   * Deselects tab.
   */
  deselect () {
    this.elements.tab.css('background-color', 'transparent')
    this.page.hide()

    this.elements.rightSmallBorder.css('display', 'block')
    this.elements.rightFullBorder.css('display', 'none')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]

    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'block')
      previousTab.elements.rightFullBorder.css({ display: 'none' })
    }

    this.selected = false
  }

  /**
   * Closes the tab.
   */
  close = () => {
    const self = this
    const tabDiv = this.elements.tab
    // If the tab is last tab.
    if (window.tabs.length === 1) {
      this.tabs.addTab()
    }

    window.app.lastClosedURL = this.page.elements.webview.getURL()

    this.tabs.timer.canReset = true

    this.removeTransition('background-color')

    tabDiv.css({
      pointerEvents: 'none'
    })

    this.page.elements.page.remove()

    // Get previous and next tab.
    var index = window.tabs.indexOf(this)
    var nextTab = window.tabs[index + 1]
    var prevTab = window.tabs[index - 1]

    // Remove the tab from array.
    window.tabs.splice(index, 1)

    if (this.selected) {
      if (nextTab != null) { // If the next tab exists, select it.
        this.tabs.selectTab(nextTab)
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          this.tabs.selectTab(prevTab)
        } else { // If the previous tab not exists, check if the first tab exists.
          if (global.tabs[0] != null) { // If first tab exists, select it.
            this.tabs.selectTab(global.tabs[0])
          }
        }
      }
    }

    if (index === global.tabs.length) { // If the tab is last.
      // Calculate all widths and positions for all tabs.
      this.tabs.setWidths()
      this.tabs.setPositions()

      if (this.width < 190) { // If tab width is less than normal tab width.
        tabDiv.remove()
      } else {
        closeAnim() // Otherwise, animate the tab.
      }
    } else {
      closeAnim() // Otherwise, animate the tab.
    }

    this.tabs.timer.time = 0

    // Animate tab closing.
    function closeAnim () {
      self.appendTransition('width')
      tabDiv.css('width', 0)

      setTimeout(function () {
        tabDiv.remove()
      }, window.tabsAnimationData.positioningDuration * 1000)
    }

    // Calculate positions for all tabs, but don't calculate widths.
    this.tabs.setPositions()
  }

  /**
   * Appends transition property to tab.
   * @param {string} transition
   */
  appendTransition = (transition) => {
    const tabDiv = this.elements.tab
    let t = ''

    if (transition === 'left') {
      t = 'left ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      t = 'width ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      t = 'background-color ' + window.tabsAnimationData.positioningDuration + 's'
    }

    tabDiv.style['-webkit-transition'] = Transitions.appendTransition(tabDiv.style['-webkit-transition'], t)
  }

  /**
  * Removes transition property from tab.
  * @param {string} transition
  */
  removeTransition = (transition) => {
    const tabDiv = this.elements.tab
    let t = ''

    if (transition === 'left') {
      t = 'left ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      t = 'width ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      t = 'background-color ' + window.tabsAnimationData.positioningDuration + 's'
    }

    tabDiv.style['-webkit-transition'] = Transitions.removeTransition(tabDiv.style['-webkit-transition'], t)
  }
}