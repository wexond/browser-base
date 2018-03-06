import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import TabGroupPages from '../TabGroupPages'

interface Props {
  tabGroup: any
}

interface State {

}

@observer
export default class Pages extends React.Component<Props, State> {
  public render(): JSX.Element {
    const {
      tabGroup
    } = this.props

    return (
      <div className='pages'>
        {
          Store.tabGroups.map((tabGroup) => {
            return <TabGroupPages key={tabGroup.id} tabGroup={tabGroup} />
          })
        }
      </div>
    )
  }
}
