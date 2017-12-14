import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Page from '../Page'

import * as tabsActions from '../../actions/tabs'

@observer
export default class Pages extends React.Component {
  render () {
    return (
      <div className='pages'>
        {
          Store.tabGroups.map(tabGroup => {
            return tabGroup.pages.map(page => {
              let tab = tabsActions.getTabById(page.id)
              return <Page key={page.id} tab={tab} page={page} />
            })
          })
        }
      </div>
    )
  }
}
