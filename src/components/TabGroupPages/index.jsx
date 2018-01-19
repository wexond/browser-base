import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../stores/store'

import Page from '../Page'

import * as tabsActions from '../../actions/tabs'

@observer
export default class TabGroupPages extends React.Component {
  render () {
    const {
      tabGroup
    } = this.props

    return (
      <div className='tab-group-pages' style={{display: (Store.currentTabGroup === tabGroup.id) ? 'flex' : 'none'}}>
        {
          tabGroup.pages.map(page => {
            let tab = tabsActions.getTabById(page.id)
            return <Page key={page.id} tab={tab} page={page} />
          })
        }
      </div>
    )
  }
}
