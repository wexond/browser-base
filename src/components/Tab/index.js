import Page from '../Page'
import Transitions from '../../helpers/Transitions'

export default class Tab {
  constructor (tabs) {
    const self = this

    this.tabs = tabs
    this.elements = {}
    this.pinned = false
    this.favicon = ''
    this.loading = false

    this.page = new Page(this)

    this.transitions = []

    this.elements.tab = div({ className: 'tab' }, tabs.elements.tabbar)

    this.elements.content = div({ className: 'tab-content' }, this.elements.tab)

    this.elements.title = div({
      className: 'tab-title',
      textContent: 'New tab'
    }, this.elements.content)

    this.elements.close = div({ className: 'tab-close' }, this.elements.content)

    this.elements.closeIcon = div({ className: 'tab-close-icon' }, this.elements.close)

    this.elements.icon = div({ className: 'tab-icon' }, this.elements.content)

    this.elements.rightSmallBorder = div({ className: 'tab-border-small-vertical' }, this.elements.tab)
    this.elements.rightSmallBorder.css('right', 0)

    this.elements.leftSmallBorder = div({ className: 'tab-border-small-vertical' }, this.elements.tab)
    this.elements.leftSmallBorder.css({
      left: 0,
      display: 'none'
    })

    this.elements.leftFullBorder = div({ className: 'tab-border-full-vertical' }, this.elements.tab)
    this.elements.leftFullBorder.css({
      left: 0,
      display: 'none'
    })

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

    this.tabs.selectTab(this)

    /** Events */

    this.elements.tab.addEventListener('mousedown', (e) => {
      if (e.target.className === 'tab-close') {
        return
      }

      if (e.button !== 0) return

      // Initialize the dragData object in {Tabs}.
      tabs.dragData = {
        tabX: e.currentTarget.offsetLeft,
        mouseClickX: e.clientX,
        canDrag: !self.pinned,
        tab: self
      }

      tabs.selectTab(self)

      if (!self.pinned) {
        window.addEventListener('mousemove', tabs.onMouseMove)
      }
    })

    this.elements.close.addEventListener('click', (e) => {
      self.close()
    })
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
    this.page.show()
    this.selected = true

    this.removeTransition('background-color')
    this.elements.tab.css({
      backgroundColor: '#fff',
      zIndex: 4
    })

    this.elements.close.css(
      {
        opacity: 1, 
        transition: '', 
        display: 'block'
      }
    )

    this.elements.rightSmallBorder.css('display', 'none')
    this.elements.leftFullBorder.css('display', (window.tabs.indexOf(this) !== 0) ? 'block' : 'none')
    this.elements.rightFullBorder.css('display', 'block')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]
    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'none')
    }

    this.elements.icon.css('display', (this.elements.tab.offsetWidth < 48) ? 'none' : 'block')

    this.setTitleMaxWidth(true)
  }

  /** 
   * Deselects tab.
   */
  deselect () {
    this.page.hide()
    this.selected = false

    this.removeTransition('background-color')
    this.elements.tab.css({
      backgroundColor: 'transparent',
      zIndex: 3
    })

    this.elements.close.css({
      display: (this.width < 48) ? 'none' : 'block',
      opacity: 0,
      transition: ''
    })

    this.elements.icon.css('display', 'block')

    this.elements.rightSmallBorder.css('display', 'block')
    this.elements.leftFullBorder.css('display', 'none')
    this.elements.rightFullBorder.css('display', 'none')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]
    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'block')
    }

    this.setTitleMaxWidth(false)
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
    if (this.transitions.indexOf(transition) !== -1) return

    const tabDiv = this.elements.tab
    let tempTransition = ''

    if (transition === 'left') {
      tempTransition = 'left ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      tempTransition = 'width ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      tempTransition = 'background-color ' + window.tabsAnimationData.positioningDuration + 's'
    }

    this.transitions.push(transition)

    tabDiv.style['-webkit-transition'] = Transitions.appendTransition(tabDiv.style['-webkit-transition'], tempTransition)
  }

  /**
  * Removes transition property from tab.
  * @param {string} transition
  */
  removeTransition = (transition) => {
    if (this.transitions.indexOf(transition) === -1) return

    const tabDiv = this.elements.tab
    let tempTransition = ''

    if (transition === 'left') {
      tempTransition = 'left ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'width') {
      tempTransition = 'width ' + window.tabsAnimationData.positioningDuration + 's ' + window.tabsAnimationData.positioningEasing
    }
    if (transition === 'background-color') {
      tempTransition = 'background-color ' + window.tabsAnimationData.positioningDuration + 's'
    }

    this.transitions.splice(this.transitions.indexOf(transition), 1)

    tabDiv.style['-webkit-transition'] = Transitions.removeTransition(tabDiv.style['-webkit-transition'], tempTransition)
  }

  /**
   * Checks if mouse x position is on any tab.
   * If it is, then replaces current tab with second tab.
   * @param {number} cursorX
   */
  findTabToReplace = (cursorX) => {
    if (!this.pinned) {
      const overTab = this.tabs.getTabFromMouseX(this, cursorX)

      if (overTab != null && !overTab.pinned) {
        const indexTab = tabs.indexOf(this)
        const indexOverTab = tabs.indexOf(overTab)

        this.tabs.replaceTabs(indexTab, indexOverTab)
      }
    }
  }

  /**
   * Updates position of tab to its place.
   */
  updatePosition = () => {
    const self = this
    let data = this.tabs.getPositions()
    // Get new position for the tab.
    const newTabPos = data.tabPositions[window.tabs.indexOf(this)]

    // Unable to reorder the tab by other tabs.
    this.locked = true

    // Animate the tab
    this.appendTransition('left')
    this.setLeft(newTabPos)

    // Unlock tab replacing by other tabs.
    setTimeout(function () {
      self.locked = false
    }, window.tabsAnimationData.positioningDuration * 1000)

    this.tabs.updateTabs()

    // Don't show left small border on replaced tab when the tab is first.
    this.elements.leftSmallBorder.css('display', (newTabPos === 0) ? 'none' : 'block')
  }

  /**
   * Sets title max width.
   * @param {Boolean} closeVisible 
   */
  setTitleMaxWidth (closeVisible = null) {
    let closeVisibleTemp = closeVisible
    let decrease = 16

    if (closeVisible == null) {
      closeVisibleTemp = (this.elements.close.css('opacity') === '1')
    }

    if (closeVisibleTemp && this.elements.close.css('display') === 'block') decrease += 20

    if (this.favicon !== '' || this.loading) {
      decrease += 30
    }
    this.elements.title.css({
      left: (this.favicon !== '' || this.loading) ? 32 : 10,
      maxWidth: `calc(100% - ${decrease}px)`
    })
  }

  /**
   * Sets title.
   * @param {String} title
   */
  setTitle (title) {
    this.elements.title.textContent = title
    this.setTitleMaxWidth()
  }

  /**
   * Sets favicon.
   * @param {String} favicon
   */
  setFavicon (favicon) {
    this.favicon = favicon
    this.elements.icon.css('background-image', `url(${favicon})`)
    this.setTitleMaxWidth()
  }
}