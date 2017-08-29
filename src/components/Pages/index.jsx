import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import Page from '../Page'

@observer
export default class Pages extends Component {
  render () {
    return (
      <div className='pages'>
        {
          Store.pages.map(page => {
            const tab = Store.tabs.filter(tab => {
              return tab.id === page.id
            })
            return <Page key={page.id} tab={tab} page={page} />
          })
        }
      </div>
    )
  }
}
