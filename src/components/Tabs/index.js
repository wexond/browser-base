class Tabs {
  constructor () {
    const self = this
    
    this.elements = {}

    this.elements.tabs = div(app.rootElement, { className: 'tabs' })

    this.elements.bottomBorder = div(this.elements.tabs, { className: 'tabs-bottom-border' })

    this.elements.handle = div(this.elements.tabs, { className: 'tabs-handle' })

    this.elements.tabbar = div(this.elements.tabs, { className: 'tabbar' })

    this.elements.addButton = div(this.elements.tabbar, { className: 'tabs-add-button' })
    this.elements.addButton.addEventListener('click', (e) => {
      self.addTab()
    })

    window.addEventListener('resize', (e) => {
      self.setWidths(self.getWidths())
      self.setPositions(self.getPositions())
    })
  }

  addTab () {
    let tab = new Tab(this)
    window.tabs.push(tab)

    this.setWidths(this.getWidths())
    this.setPositions(this.getPositions())

    this.selectTab(tab)
  }

  selectTab (tab) {
    for (var x = 0; x < window.tabs.length; x++) {
      if (window.tabs[x] !== tab) {
        window.tabs[x].deselect()
      }
    }
    tab.select()
  }

  getWidths () {
    let tabbarWidth = this.elements.tabbar.offsetWidth - this.elements.addButton.offsetWidth
    let tabWidth = (tabbarWidth / window.tabs.length)

    if (tabWidth > 190) {
      tabWidth = 190
    }

    return tabWidth
  }

  setWidths (width) {
    for (var x = 0; x < window.tabs.length; x++) {
      window.tabs[x].setWidth(width)
      window.tabs[x].width = width
    }
  }

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

  setPositions (positions) {
    for (var x = 0; x < window.tabs.length; x++) {
      window.tabs[x].setLeft(positions.tabPositions[x])
    }

    this.elements.addButton.css('left', positions.addButtonPosition)
  } 
}