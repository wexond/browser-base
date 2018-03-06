import { platform } from 'os'
import React from 'react'

import Controls from '../Controls'

import { observer } from 'mobx-react'
import Store from '../../store'

import Colors from '../../utils/colors'

interface Props {

}

interface State {

}

@observer
export default class SystemBar extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
  }

  public render () {
    let backColor = Colors.shadeColor(Store.backgroundColor, -0.2)

    if (Store.backgroundColor === '#fff') { backColor = Colors.shadeColor(Store.backgroundColor, -0.1) }

    const onGroupsMouseDown = (e: any) => {
      e.stopPropagation()

      Store.app.tabMenu.hide()
      Store.app.pageMenu.hide()
      Store.app.menu.hide()
    }

    const onGroupsClick = (e: any) => {
      e.stopPropagation()

      if (Store.app.tabGroupsMenu.visible) {
        Store.app.tabGroupsMenu.hide()
      } else {
        Store.app.tabGroupsMenu.show()
      }
    }

    const systemBarStyle = {
      backgroundColor: backColor,
      display: (Store.isFullscreen) ? 'none' : 'flex',
      height: platform() == 'darwin' ? 34 : 32
    }

    return (
      <div className={'system-bar ' + Store.foreground} style={systemBarStyle}>
        {this.props.children}
        <div onMouseDown={onGroupsMouseDown} onClick={onGroupsClick} className='groups'></div>
        {platform() !== 'darwin' && <div className='border-vertical2'></div> }
        {platform() !== 'darwin' && <Controls /> }
        <div className='border-bottom' />
      </div>
    )
  }
}
