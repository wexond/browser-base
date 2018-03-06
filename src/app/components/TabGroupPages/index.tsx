import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Page from '../Page'

import * as tabsActions from '../../actions/tabs'
import TabGroup from '../TabGroup';

interface Props {
  tabGroup: TabGroup
}

interface State {

}

@observer
export default class TabGroupPages extends React.Component<Props, State> {
  public render (): JSX.Element {
    const {
      tabGroup
    } = this.props

    return (
      <div className='tab-group-pages' style={{display: (Store.currentTabGroup === tabGroup.id) ? 'flex' : 'none'}}>
        {
          tabGroup.pages.map(page => {
            const tab = tabsActions.getTabById(page.id)
            return <Page key={page.id} tab={tab} page={page} />
          })
        }
      </div>
    )
  }
}
