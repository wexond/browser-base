import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'

import Store from '../../store'

export default class App extends Component {
  componentDidMount () {
    Store.init()
  }

  render () {
    return (
      <div>
        <SystemBar>
          <Tabs></Tabs>
        </SystemBar>
      </div>
    )
  }
}