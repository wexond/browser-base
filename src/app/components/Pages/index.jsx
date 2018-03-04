import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

import TabGroupPages from '../TabGroupPages'

@observer
export default class Pages extends React.Component {
  render () {
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
