import Component from '../../component'
import UI from '../../ui'

import Page from '../Page'
import Preloader from '../Preloader'

import Store from '../../store'
import Transitions from '../../utils/Transitions'

import tabsDefaults from '../../defaults/tabs'
import { updateTabs } from '../../actions/tabs'

export default class Tab extends Component {
  beforeRender () {
    this.tabs = this.props.tabs

    this.pinned = false
    this.favicon = ''
    this.loading = false
    this.transitions = []
    this.blockLeftAnimation = true

    this.colors = {
      select: '#fff',
      hover: '#fff'
    }

    Store.tabs.push(this)
  }

  render () {
    UI.render(<Page url={this.props.url} tab={this} ref={(e) => { this.page = e }} />, Store.app.elements.pages, this)

    return (
      <div className='tab' ref='tab'>
        <div className='tab-content' ref='content'>
          <div className='tab-title' ref='title'>
            New tab
          </div>
          <div className='tab-close' ref='close'>
            <div className='tab-close-icon' ref='closeIcon' />
          </div>
          <div className='tab-icon' ref='icon' />
          <Preloader ref='preloader' className='tab-preloader' />
        </div>
        <div className='tab-border-small-vertical' style={{right: 0}} ref='rightSmallBorder' />
        <div className='tab-border-small-vertical' style={{left: 0, display: 'none'}} ref='leftSmallBorder' />
        <div className='tab-border-full-vertical' style={{left: 0, display: 'none'}} ref='leftFullBorder' />
        <div className='tab-border-full-vertical' style={{right: 0, display: 'none'}} ref='rightFullBorder' />
      </div>
    )
  }

  afterRender () {
    const self = this

    let position = this.tabs.getPositions().tabPositions[Store.tabs.indexOf(this)]
    this.setLeft(position)

    setTimeout(() => {
      self.blockLeftAnimation = false

      self.tabs.setWidths()
      self.tabs.setPositions()
    }, 1)

    /** Events */

    this.elements.tab.addEventListener('mousedown', (e) => {
      if (e.target.className === 'tab-close' && e.button !== 0) {
        return
      }

      // Initialize the dragData object in {Tabs}.
      self.tabs.dragData = {
        tabX: e.currentTarget.offsetLeft,
        mouseClickX: e.clientX,
        canDrag: !self.pinned,
        tab: self
      }

      self.tabs.selectTab(self)

      if (!self.pinned) {
        window.addEventListener('mousemove', self.tabs.onMouseMove)
      }
    })

    this.elements.close.addEventListener('click', (e) => {
      self.close()
    })

    if (this.props.select) {
      this.tabs.selectTab(this)
    } else {
      this.tabs.selectTab(this.tabs.selectedTab)
    }

    this.updateBorders()
  }

  /**
   * Shows or hides preloader.
   * @param {Boolean}
   */
  togglePreloader (flag) {
    this.elements.icon.style.display = (!flag) ? 'block' : 'none'
    this.elements.preloader.getRoot().style.display = (!flag) ? 'none' : 'block'

    this.loading = flag
    this.setTitleMaxWidth()
  }

  /**
   * Sets width of tab div.
   * @param {Number} width
   */
  setWidth (width) {
    this.elements.tab.style.width = width + 'px'
    this.width = width
  }
  /**
   * Sets left of tab div.
   * @param {Number} left
   */
  setLeft (left) {
    this.elements.tab.style.left = left + 'px'
  }

  /**
   * Selects tab.
   */
  select () {
    const app = window.app
    const webview = this.page.elements.webview
    const bar = Store.app.elements.bar
    this.page.show()

    this.selected = true

    this.appendTransition('background-color')
    this.elements.tab.setCSS({
      backgroundColor: this.colors.select,
      zIndex: 4
    })

    this.elements.close.setCSS({
      opacity: 1,
      transition: '',
      display: (this.pinned) ? 'none' : 'block'
    })

    this.elements.icon.setCSS({display: (this.elements.tab.offsetWidth < 48 && !this.pinned) ? 'none' : 'block'})

    if (this.certificate != null) {
      bar.setCertificate(this.certificate.type, this, this.certificate.name, this.certificate.country)
    }

    if (webview.getWebContents() != null) {
      accessWebContents()
    } else {
      // Wait until the webview's webcontents load.
      let event
      webview.addEventListener('webcontents-load', event = function (e) {
        accessWebContents()
        webview.removeEventListener('webcontents-load', event)
      })
    }

    function accessWebContents () {
      const url = webview.getURL()
      const title = webview.getTitle()

      bar.setURL(url)

      bar.updateNavigationIcons()
      Store.app.elements.webviewMenu.updateNavigationIcons()
    }

    Store.app.changeUIColors(this.colors.select, this)

    this.setTitleMaxWidth()

    this.updateBorders()
  }

  /**
   * Deselects tab.
   */
  deselect () {
    this.page.hide()
    this.selected = false

    this.removeTransition('background-color')
    this.elements.tab.setCSS({
      backgroundColor: 'transparent',
      zIndex: 3
    })

    this.elements.close.setCSS({
      display: (this.width < 48) ? 'none' : 'block',
      opacity: 0,
      transition: ''
    })

    this.elements.icon.setCSS({display: 'block'})

    this.setTitleMaxWidth(false)

    this.updateBorders()
  }

  /**
   * Pins or unpins tab.
   */
  pin () {
    // Set pinned state.
    if (!this.pinned) {
      this.elements.close.setCSS({display: 'none'})
      this.elements.title.setCSS({display: 'none'})

      let newItems = Store.app.elements.tabMenu.menuItems

      newItems[2].title = 'Unpin tab'

      Store.app.elements.tabMenu.updateItems(newItems)
    } else {
      this.elements.title.setCSS({display: 'block'})
      this.elements.close.setCSS({display: 'block'})

      let newItems = Store.app.elements.tabMenu.menuItems

      newItems[2].title = 'Pin tab'

      Store.app.elements.tabMenu.updateItems(newItems)
    }

    this.pinned = !this.pinned

    // Move the pinned tab to first position.
    var tempTabs = []
    for (var i = 0; i < Store.tabs.length; i++) {
      if (Store.tabs[i].pinned) {
        tempTabs.push(Store.tabs[i])
      }
    }

    for (i = 0; i < Store.tabs.length; i++) {
      if (!Store.tabs[i].pinned) {
        tempTabs.push(Store.tabs[i])
      }
    }
    Store.tabs = tempTabs

    // Calculate all widths and positions for all tabs.
    this.tabs.setWidths()
    this.tabs.setPositions()

    updateTabs()
  }

  /**
   * Closes the tab.
   */
  close () {
    const self = this
    const tabDiv = this.elements.tab
    // If the tab is last tab.
    if (Store.tabs.length === 1) {
      this.tabs.addTab()
    }

    Store.app.lastClosedURL = this.page.elements.webview.getURL()

    this.tabs.timer.canReset = true

    this.removeTransition('background-color')

    tabDiv.setCSS({pointerEvents: 'none'})

    this.page.elements.page.remove()

    // Get previous and next tab.
    var index = Store.tabs.indexOf(this)
    var nextTab = Store.tabs[index + 1]
    var prevTab = Store.tabs[index - 1]

    // Remove the tab from array.
    Store.tabs.splice(index, 1)

    if (this.selected) {
      if (nextTab != null) { // If the next tab exists, select it.
        this.tabs.selectTab(nextTab)
      } else { // If the next tab not exists.
        if (prevTab != null) { // If previous tab exists, select it.
          this.tabs.selectTab(prevTab)
        } else { // If the previous tab not exists, check if the first tab exists.
          if (Store.tabs[0] != null) { // If first tab exists, select it.
            this.tabs.selectTab(Store.tabs[0])
          }
        }
      }
    }

    if (index === Store.tabs.length) { // If the tab is last.
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
      self.setWidth(0)

      setTimeout(function () {
        tabDiv.remove()
      }, tabsDefaults.transitions.width.duration * 1000)
    }

    // Calculate positions for all tabs, but don't calculate widths.
    this.tabs.setPositions()
  }

  /**
   * Appends transition property to tab.
   * @param {string} transitionToAdd
   */
  appendTransition (transitionToAdd) {
    if (this.transitions.indexOf(transitionToAdd) !== -1) return

    const tabDiv = this.elements.tab
    const transitionData = tabsDefaults.transitions[transitionToAdd]
    let transition = transitionToAdd + ' ' + transitionData.duration + 's ' + transitionData.easing

    this.transitions.push(transitionToAdd)

    let newTransition = Transitions.appendTransition(tabDiv.style['-webkit-transition'], transition)
    tabDiv.style['-webkit-transition'] = newTransition
  }

  /**
  * Removes transition property from tab.
  * @param {string} transitionToRemove
  */
  removeTransition (transitionToRemove) {
    if (this.transitions.indexOf(transitionToRemove) === -1) return

    const tabDiv = this.elements.tab
    const transitionData = tabsDefaults.transitions[transitionToRemove]
    let transition = transitionToRemove + ' ' + transitionData.duration + 's ' + transitionData.easing

    this.transitions.splice(this.transitions.indexOf(transitionToRemove), 1)

    let newTransition = Transitions.removeTransition(tabDiv.style['-webkit-transition'], transition)
    tabDiv.style['-webkit-transition'] = newTransition
  }

  /**
   * Updates position of tab to its place.
   */
  updatePosition () {
    const self = this
    let data = this.tabs.getPositions()
    // Get new position for the tab.
    const newTabPos = data.tabPositions[Store.tabs.indexOf(this)]

    // Unable to reorder the tab by other tabs.
    this.locked = true

    // Animate the tab
    this.appendTransition('left')
    this.setLeft(newTabPos)

    // Unlock tab replacing by other tabs.
    setTimeout(function () {
      self.locked = false
    }, tabsDefaults.transitions.left.duration * 1000)

    updateTabs()
  }

  /**
   * Sets title max width.
   * @param {Boolean} closeVisible
   */
  setTitleMaxWidth (closeVisible = null) {
    let closeVisibleTemp = closeVisible
    let decrease = 16

    if (closeVisible == null) {
      closeVisibleTemp = (this.elements.close.getCSS('opacity') === '1' && !this.pinned)
    }

    if (closeVisibleTemp && this.elements.close.getCSS('display') === 'block') decrease += 20

    if (this.favicon !== '' || this.loading) {
      decrease += 29
    }
    this.elements.title.setCSS({
      left: (this.favicon !== '' || this.loading) ? 32 : 9,
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
    this.elements.icon.setCSS({
      backgroundImage: `url(${favicon})`
    })
    this.setTitleMaxWidth()
  }

  updateBorders () {
    let previousTab = Store.tabs[Store.tabs.indexOf(this) - 1]

    this.elements.rightSmallBorder.setCSS({
      display: (this.selected) ? 'none' : 'block'
    })

    this.elements.leftFullBorder.setCSS({
      display: (this.selected) ? ((Store.tabs.indexOf(this) !== 0) ? 'block' : 'none') : 'none'
    })

    this.elements.rightFullBorder.setCSS({
      display: (this.selected) ? 'block' : 'none'
    })

    if (previousTab != null) {
      if (this.selected) {
        previousTab.elements.rightSmallBorder.setCSS({
          display: 'none'
        })
      }
    }

    this.elements.leftSmallBorder.setCSS({
      display: 'none'
    })
  }

  getWebView () {
    return this.page.elements.webview
  }
}
