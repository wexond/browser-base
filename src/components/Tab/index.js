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

    this.elements.tab = div({ className: 'tab' }, tabs.elements.tabbar)
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

    this.elements.content = div({ className: 'tab-content' }, this.elements.tab)

    this.elements.title = div({
      className: 'tab-title',
      textContent: 'New tab'
    }, this.elements.content)

    this.elements.close = div({ className: 'tab-close' }, this.elements.content)
    this.elements.close.addEventListener('click', (e) => {
      self.close()
    })

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
    this.page.show()

    this.elements.rightSmallBorder.css('display', 'none')
    if (window.tabs.indexOf(this) !== 0) {
      this.elements.leftFullBorder.css('display', 'block')
    } else {
      this.elements.leftFullBorder.css('display', 'none')
    }
    this.elements.rightFullBorder.css('display', 'block')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]

    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'none')
    }

    if (this.elements.tab.offsetWidth < 48) {
      this.elements.icon.css('display', 'none')
    } else {
      this.elements.icon.css('display', 'block')
    }

    this.setTitleMaxWidth(true)

    this.selected = true
  }

  /** 
   * Deselects tab.
   */
  deselect () {
    this.removeTransition('background-color')
    this.elements.tab.css({
      backgroundColor: 'transparent',
      zIndex: 3
    })

    if (this.elements.tab.offsetWidth < 48) {
      this.elements.close.css('display', 'none')
    } else {
      this.elements.close.css('display', 'block')
    }

    this.elements.icon.css('display', 'block')

    this.elements.close.css({opacity: 0, transition: ''})
    this.page.hide()

    this.elements.rightSmallBorder.css('display', 'block')
    this.elements.leftFullBorder.css('display', 'none')
    this.elements.rightFullBorder.css('display', 'none')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]

    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'block')
    }

    this.setTitleMaxWidth(false)

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

    this.tabs.updateTabs()
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

  /**
   * Checks if mouse x position is on any tab.
   * If it is, then replaces current tab with second tab.
   * @param {number} cursorX
   */
  findTabToReplace = (cursorX) => {
    if (!this.pinned) {
      const overTab = this.tabs.getTabFromMouseX(this, cursorX)

      if (overTab != null && !overTab.pinned) {
        const indexTab = window.tabs.indexOf(this)
        const indexOverTab = window.tabs.indexOf(overTab)

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

    // Show or hide tab's borders.
    if (newTabPos === 0) {
      this.elements.leftSmallBorder.css('display', 'none')
    } else {
      this.elements.leftSmallBorder.css('display', 'block')
    }
  }

  /**
   * Sets title max width.
   * @param {Boolean} closeVisible 
   */
  setTitleMaxWidth (closeVisible = null) {
    let b = closeVisible
    if (closeVisible == null) {
      b = (this.elements.close.css('opacity') === '1')
    }
    let decrease = 16
    if (b && this.elements.close.css('display') === 'block') decrease += 20
    this.elements.title.css('left', 8)
    if (this.favicon !== '' || this.loading) {
      decrease += 28
      this.elements.title.css('left', 32)
    }

    this.elements.title.css('max-width', `calc(100% - ${decrease}px)`)
  }

  /**
   * Sets title.
   * @param {String} title
   */
  setTitle (title) {
    this.setTitleMaxWidth()

    this.elements.title.textContent = title

    this.update()
  }

  /**
   * Sets favicon.
   * @param {String} favicon
   */
  setFavicon (favicon) {
    this.favicon = favicon

    this.setTitleMaxWidth()

    this.elements.icon.css('background-image', `url(${favicon})`)

    this.update()
  }

  /**
   * Updates content sizes of tab.
   */
  update () {
    if (!this.selected) {
      this.elements.close.css('display', (this.elements.tab.offsetWidth < 48) ? 'none' : 'block')
      this.elements.icon.css('display', 'block')
    } else {
      this.elements.close.css('display', 'block')
      this.elements.icon.css('display', (this.elements.tab.offsetWidth < 48) ? 'none' : 'block')
    }
  }
}