import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'
import Bar from '../Bar'

export default class App extends Component {
  render () {
    return (
      <div className='app'>
        <SystemBar>
          <Tabs></Tabs>
        </SystemBar>
        <Bar></Bar>
        <Pages></Pages>
      </div>
    )
  }
}