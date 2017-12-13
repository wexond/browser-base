import React from 'react'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'
import Bar from '../Bar'
import Suggestions from '../Suggestions'
import Menu from '../Menu'
import MenuNavigation from '../MenuNavigation'
import Dialog from '../Dialog'
import TabGroupsMenu from '../TabGroupsMenu'

import Store from '../../store'

import { observer } from 'mobx-react'

import { pageMenuItems } from '../../defaults/page-menu-items'

@observer
export default class App extends React.Component {
  constructor () {
    super()
  }

  componentDidMount () {
    Store.app = this

    window.addEventListener('mousedown', (e) => {
      this.suggestions.hide()
      this.pageMenu.hide()
      this.tabGroupsMenu.hide()
    })

    window.addEventListener('click', (e) => {
      this.pageMenu.hide()
      this.tabGroupsMenu.hide()
    })

    window.addEventListener('mousemove' , (e) => {
      Store.cursor.x = e.pageX
      Store.cursor.y = e.pageY
    })

    this.pageMenu.setState({items: pageMenuItems})
  }

  refreshIconsState () {
    this.menuNavigation.refreshIconsState()
    this.bar.refreshIconsState()
  }

  render () {
    const onVisibilityChange = (e) => {
      if (!e) {
        Store.editingTabGroup = -1
      }
    }

    return (
      <div className='app'>
        <SystemBar>
          <Tabs ref={(r) => { this.tabs = r }} />
        </SystemBar>
        <Bar ref={(r) => { this.bar = r }} />
        <Suggestions ref={(r) => { this.suggestions = r }} />
        <Pages />
        <Menu ref={(r) => { this.pageMenu = r }}>
          <MenuNavigation ref={(r) => { this.menuNavigation = r }}></MenuNavigation>
          <div className='separator' style={{marginTop: 0}}></div>
        </Menu>
        <Menu ref={(r) => { this.tabGroupsMenu = r }} right={8} top={8} onVisibilityChange={onVisibilityChange}>
          <TabGroupsMenu></TabGroupsMenu>
        </Menu>
      </div>
    )
  }
}