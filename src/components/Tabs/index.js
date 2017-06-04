import Tab from '../Tab'

export default class Tabs {
  constructor () {
    const self = this
    
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
      self.setWidths(self.getWidths())
      self.setPositions(self.getPositions())
    })

    this.addTab()
  }

  /**
   * Adds tab.
   * @param {Object} data 
   */
  addTab (data = window.defaultTabOptions) {
    let tab = new Tab(this)
    window.tabs.push(tab)

    this.setWidths(this.getWidths())
    this.setPositions(this.getPositions())

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
   * @param {Number} width 
   */
  setWidths (width) {
    for (var x = 0; x < window.tabs.length; x++) {
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
   * @param {Object} positions 
   */
  setPositions (positions) {
    for (var x = 0; x < window.tabs.length; x++) {
      window.tabs[x].setLeft(positions.tabPositions[x])
    }

    this.elements.addButton.css('left', positions.addButtonPosition)
  } 
}