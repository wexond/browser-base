import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Page from '../Page'

@observer
export default class Pages extends React.Component {
  render () {
    return (
      <div className='pages'>
        {
          Store.pages.map(page => {
            let tab = null
            for (var x = 0; x < Store.tabGroups.length; x++) {
              for (var y = 0; y < Store.tabGroups[x].tabs.length; y++) {
                if (Store.tabGroups[x].tabs[y].id === page.id) {
                  tab = Store.tabGroups[x].tabs[y]
                }
              }
            }

            return <Page key={page.id} tab={tab} page={page} />
          })
        }
      </div>
    )
  }
}
