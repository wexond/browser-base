class Tab {
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

    this.elements.rightSmallBorder = div({ className: 'border-small' }, this.elements.tab)
    this.elements.rightSmallBorder.css('right', -1)

    this.elements.rightFullBorder = div({ className: 'border-full' }, this.elements.tab)
    this.elements.rightFullBorder.css({
      right: -1,
      display: 'none'
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
    this.elements.tab.css('background-color', '#fff')
    this.page.show()

    this.elements.rightSmallBorder.css('display', 'none')
    this.elements.rightFullBorder.css('display', 'block')

    let previousTab = window.tabs[window.tabs.indexOf(this) - 1]

    if (previousTab != null) {
      previousTab.elements.rightSmallBorder.css('display', 'none')
      previousTab.elements.rightFullBorder.css('display', 'block')
    }
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
      previousTab.elements.rightFullBorder.css('display', 'none')
    }
  }
}