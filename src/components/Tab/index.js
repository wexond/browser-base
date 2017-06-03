class Tab {
  constructor (tabs) {
    const self = this

    this.tabs = tabs
    this.elements = {}

    this.page = new Page(this)

    this.elements.tab = div(tabs.elements.tabbar, { className: 'tab' })
    this.elements.tab.addEventListener('mousedown', (e) => {
      tabs.selectTab(self)
    })

    this.elements.content = div(this.elements.tab, { className: 'tab-content' })

    this.elements.title = div(this.elements.content, {
      className: 'tab-title',
      innerHTML: 'New tab'
    })

    this.elements.rightSmallBorder = div(this.elements.tab, { className: 'border-small' })
    this.elements.rightSmallBorder.css('right', -1)

    this.elements.rightFullBorder = div(this.elements.tab, { className: 'border-full' })
    this.elements.rightFullBorder.css({
      right: -1,
      display: 'none'
    })
  }

  setWidth (width) {
    this.elements.tab.css('width', width)
  }

  setLeft (left) {
    this.elements.tab.css('left', left)
  }

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