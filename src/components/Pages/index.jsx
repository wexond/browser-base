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
            const tab = Store.tabs.filter(item => {
              return item.id === page.id
            })[0]
            return <Page key={page.id} tab={tab} page={page} />
          })
        }
      </div>
    )
  }
}
