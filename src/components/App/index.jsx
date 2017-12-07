import Component from 'inferno-component'

import SystemBar from '../SystemBar'
import Tabs from '../Tabs'
import Pages from '../Pages'
import Bar from '../Bar'
import Suggestions from '../Suggestions'
import Menu from '../Menu'

import Store from '../../store'

import { connect } from 'inferno-mobx'

import { pageMenuItems } from '../../defaults/page-menu-items'

@connect
export default class App extends Component {
  constructor () {
    super()
  }

  componentDidMount () {
    Store.app = this

    window.addEventListener('mousedown', (e) => {
      this.suggestions.hide()
      this.hidePageMenu()
    })

    window.addEventListener('mousemove' , (e) => {
      Store.cursor.x = e.pageX
      Store.cursor.y = e.pageY
    })

    this.setPageMenuItems(pageMenuItems)
  }

  showPageMenu () {
    this.pageMenu.show()
  }

  hidePageMenu () {
    this.pageMenu.hide()
  }

  setPageMenuItems (items) {
    this.pageMenu.setState({items: items})
  }

  render () {
    return (
      <div className='app'>
        <SystemBar>
          <Tabs />
        </SystemBar>
        <Bar ref={(r) => { this.bar = r }} />
        <Suggestions ref={(r) => { this.suggestions = r }} />
        <Pages />
        <Menu ref={(r) => { this.pageMenu = r }} />
      </div>
    )
  }
}