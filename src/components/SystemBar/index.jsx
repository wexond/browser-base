import React from 'react'

import Controls from '../Controls'

import Store from '../../store'
import { observer } from 'mobx-react'

import Colors from '../../utils/colors'

@observer
export default class SystemBar extends React.Component {
  constructor () {
    super()
  }

  render () {
    let backColor = Colors.shadeColor(Store.backgroundColor, -0.2)

    if (Store.backgroundColor === '#fff') backColor = Colors.shadeColor(Store.backgroundColor, -0.1)

    const onGroupsMouseDown = e => {
      e.stopPropagation()

      Store.app.pageMenu.hide()
    }

    const onGroupsClick = (e) => {
      e.stopPropagation()

      if (Store.app.tabGroupsMenu.visible) {
        Store.app.tabGroupsMenu.hide()
      } else {
        Store.app.tabGroupsMenu.show()
      }
    }

    const systemBarStyle = {
      backgroundColor: backColor,
      display: (Store.isFullscreen) ? 'none' : 'flex'
    }

    return (
      <div className={'system-bar ' + Store.foreground} style={systemBarStyle}>
        {this.props.children}
        <div onMouseDown={onGroupsMouseDown} onClick={onGroupsClick} className='groups'></div>
        <div className='border-vertical2'></div>
        <Controls />
        <div className='border-bottom' />
      </div>
    )
  }
}
