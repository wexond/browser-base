import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import Page from '../Page'

@observer
export default class Pages extends Component {
  render () {
    const tabs = Store.tabs.filter(Boolean)
    return (
      <div className='pages'>
        {
          tabs.map(item => {
            return <Page data={item} />
          })
        }
      </div>
    )
  }
}
