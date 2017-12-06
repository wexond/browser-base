import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'
import Bar from '../Bar'
import Suggestions from '../Suggestions'

import Store from '../../store'

import { connect } from 'inferno-mobx'

@connect
export default class App extends Component {
  componentDidMount () {
    Store.app = this

    window.addEventListener('mousedown', (e) => {
      this.suggestions.hide()
    })
  }

  render () {
    return (
      <div className='app'>
        <SystemBar>
          <Tabs></Tabs>
        </SystemBar>
        <Bar ref={(r) => { this.bar = r }}></Bar>
        <Suggestions ref={(r) => { this.suggestions = r }}></Suggestions>
        <Pages></Pages>
      </div>
    )
  }
}