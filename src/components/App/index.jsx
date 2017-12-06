import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'
import Bar from '../Bar'
import Suggestions from '../Suggestions'
import Menu from '../Menu'

import Store from '../../store'

import { connect } from 'inferno-mobx'

@connect
export default class App extends Component {
  constructor () {
    super()

    this.state = {
      menuItems: [
        {
          title: 'First item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
        {
          title: 'Second item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
        {
          title: 'Third item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
        {
          type: 'separator'
        },
        {
          title: 'First item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
        {
          title: 'Second item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
        {
          title: 'Third item',
          type: 'item',
          onClick: () => {
            alert('x')
          }
        },
      ]
    }
  }

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
        <Menu ref={(r) => this.menu = r } items={this.state.menuItems} />
      </div>
    )
  }
}