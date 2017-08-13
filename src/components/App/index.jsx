import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'

export default class App extends Component {
  render () {
    return (
      <div className='app'>
        <SystemBar>
          <Tabs></Tabs>
        </SystemBar>
        <Pages></Pages>
      </div>
    )
  }
}