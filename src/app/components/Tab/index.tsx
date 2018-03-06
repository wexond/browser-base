import React from 'react'

import Store from '../../store'

import { observer } from 'mobx-react'

import Transitions from '../../utils/transitions'

import tabDefaults from '../../defaults/tabs'
import wexondUrls from '../../defaults/wexond-urls'

import * as tabGroupsActions from '../../actions/tab-groups'
import * as tabsActions from '../../actions/tabs'

import Colors from '../../utils/colors'

import Ripple from '../../../Material/Ripple'
import MenuItem from '../MenuItem'

import Preloader from '../../../Material/Preloader'
import Page from '../Page';
import TabGroup from '../TabGroup';
import Tabs from '../Tabs';

interface Props {
  tab: Tab,
  tabs: Tabs, 
  tabGroup: TabGroup,
}

interface State {
  hovered: boolean,
}

@observer
export default class Tab extends React.Component<Props, State> {
  public dragData: any
  public tab: Tab | HTMLDivElement
  public id: number
  public url: string
  public width: number
  public left: number
  public animateLeft: boolean
  public animateWidth: boolean
  public title: string
  public favicon: string
  public pinned: boolean
  public loading: boolean
  private shouldRender: boolean
  public closing: boolean
  public backgroundColor: string
  public barBorder: string
  public ogData: any

  constructor(props: Props) {
    super(props)

    this.state = {
      hovered: false,
    }
    this.dragData = {}
  }

  public componentDidMount() {
    const tab = this.props.tab
    tab.tab = this
    if (tab.select) {
      this.select()
    }
  }

  public select() {
    const tab = this.props.tab
    Store.selectedTab = this.props.tab.id
  }

  public close = (e?: React.MouseEvent<HTMLDivElement>) => {
    Store.app.restoreTabsAnimations()

    const tab = this.props.tab
    const tabs = this.props.tabs
    const isSelected = Store.selectedTab === tab.id

    Store.app.suggestions.hide()

    const tabGroup = tabGroupsActions.getCurrentTabGroup()

    // Get the tab url and store in Store.
    Store.lastClosedURL = tab.url

    if (tabGroup.tabs.length === 1) {
      tabGroupsActions.removeTabGroup(tabGroup)
      return
    }

    // Get previous and next tab.
    const index = tabGroup.tabs.indexOf(tab)

    // Get page from array by its unique id.
    const page = tabGroup.pages.filter((page: Page) => {
      return tab.id === page.id
    })[0]

    // Remove page from array.
    tabGroup.pages.splice(tabGroup.pages.indexOf(page), 1)

    // Remove tab from array.
    tabGroup.tabs.splice(index, 1)

    // If the closed tab was selected, select other tab.
    if (isSelected && tabGroup.tabs.length !== 0) {
      if (index === tabGroup.tabs.length) {
        // If the tab is last.
        Store.selectedTab = tabGroup.tabs[index - 1].id // Select previous tab.
      } else {
        Store.selectedTab = tabGroup.tabs[index].id // Select next tab.
      }
    }

    this.props.tabGroup.resetTimer()

    // If the tab is last.
    if (index === tabGroup.tabs.length) {
      // If the tab width is less than normal tab width
      //  and the tab width is greater than 32.
      if (tab.width < tabDefaults.maxTabWidth && tab.width > 32) {
        tab.shouldRender = false
        Store.app.tabs.updateTabs()
        return
      }
    }

    // Animate tabs.
    tab.animateWidth = true
    tab.closing = true
    tabsActions.setPositions()
  }

  public render(): JSX.Element {
    const tab = this.props.tab
    const isSelected = Store.selectedTab === tab.id
    const tabs = this.props.tabs

    const tabGroup = tabGroupsActions.getCurrentTabGroup().tabs

    const {
      width,
      left,
      animateLeft,
      animateWidth,
      title,
      favicon,
      pinned,
      loading,
      shouldRender,
      closing,
    } = tab

    if (!shouldRender) {
      return null
    }

    const { hovered } = this.state

    // Control transitions.
    let transition =
      tabDefaults.transitions["background-color"].duration +
      "s" +
      " background-color " +
      tabDefaults.transitions["background-color"].easing

    if (animateLeft && Store.tabAnimateLeft) {
      const newTransition =
        tabDefaults.transitions.left.duration +
        "s" +
        " left " +
        tabDefaults.transitions.left.easing
      transition = Transitions.appendTransition(transition, newTransition)
    }

    if (animateWidth && Store.tabAnimateWidth) {
      const newTransition =
        tabDefaults.transitions.width.duration +
        "s" +
        " width " +
        tabDefaults.transitions.width.easing
      transition = Transitions.appendTransition(transition, newTransition)
    }

    const tabStyle = {
      width: closing ? 0 : width,
      left,
      transition,
      backgroundColor: isSelected ? tab.backgroundColor : "transparent",
      zIndex: isSelected ? 3 : 1,
      pointerEvents: closing ? "none" : "auto",
    }

    let faviconDisplay = "none"

    if (favicon !== "") {
      faviconDisplay = "block"
    }
    if (isSelected && width < 42) {
      faviconDisplay = "none"
    }
    if (loading) {
      faviconDisplay = "none"
    }

    const faviconStyle = {
      display: faviconDisplay,
      backgroundImage: `url(${favicon})`,
    }

    const closeStyle = {
      display: pinned || (!isSelected && width < 42) ? "none" : "block",
      opacity: isSelected || hovered ? 1 : 0,
    }

    // Set title max width, based on favicon and close visibility.
    let maxWidthDecrease = 16
    const closeWidth = 16
    const faviconWidth = 16
    const margins = 8
    let titleLeft = 12

    if (isSelected || hovered) {
      maxWidthDecrease = closeWidth + 2 * margins
    }

    if (favicon !== "" || loading) {
      maxWidthDecrease += faviconWidth + 2 * margins
      titleLeft += faviconWidth + margins
    }

    const titleStyle = {
      maxWidth: `calc(50% - ${maxWidthDecrease}px)`,
      display: pinned || (!isSelected && width < 42) ? "none" : "block",
      left: titleLeft * 2,
    }

    const overlayStyle = {
      opacity: (!isSelected && hovered) || closing ? 1 : 0,
      backgroundColor: closing ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.5)",
    }

    const contentDisplay = "block"

    const contentStyle = {
      display: "block",
    }

    const borderLeftStyle = {
      display: isSelected && tabGroup.indexOf(tab) !== 0 ? "block" : "none",
      left: 0,
      opacity: isSelected ? (Store.foreground === "white" ? 0 : 1) : 1,
    }

    const selectedTab: Tab = tabGroup.filter((ttab: Tab) => {
      return ttab.id === Store.selectedTab
    })

    const borderRightStyle = {
      display:
        tabGroup.indexOf(selectedTab) - 1 === tabGroup.indexOf(tab)
          ? "none"
          : "block",
      right: isSelected ? 0 : -1,
      height: isSelected ? "100%" : "calc(100% - 8px)",
      opacity: isSelected ? (Store.foreground === "white" ? 0 : 1) : 1,
    }

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      if (!isSelected) {
        this.select()
      }
      Store.tabDragData = {
        isMouseDown: true,
        mouseClickX: e.clientX + tabs.tabs.scrollLeft,
        left,
        tab,
      }
    }

    const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 1) {
        // Middle mouse button.
        this.close()
      }
    }

    const onMouseEnter = () => {
      this.setState({ hovered: true })
    }

    const onMouseLeave = () => {
      this.setState({ hovered: false })
    }

    const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) =>
      e.stopPropagation()

    const tabEvents = {
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    }

    const preloaderStyle = {
      display: loading ? "block" : "none",
    }

    return (
      <div
        ref={(r) => {
          this.tab = r
        }}
        className={"tab " + Store.foreground}
        style={tabStyle}
        {...tabEvents}
      >
        <div className="overlay" style={overlayStyle} />
        <div className="border-vertical" style={borderLeftStyle} />
        <div className="border-vertical" style={borderRightStyle} />
        <div className="content" style={contentStyle}>
          <Preloader className={Store.foreground} style={preloaderStyle} />
          <div className="favicon" style={faviconStyle} />
          <div className="title" style={titleStyle}>
            {title}
          </div>
          <div
            className="close"
            onClick={this.close}
            onMouseDown={onCloseMouseDown}
            style={closeStyle}
          >
            <Ripple center={true} scale={8} />
            <div className="icon" />
          </div>
        </div>
      </div>
    )
  }
}