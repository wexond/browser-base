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
  }

  componentDidMount () {
    Store.app = this

    window.addEventListener('mousedown', (e) => {
      this.suggestions.hide()
      this.pageMenu.hide()
    })

    window.addEventListener('mousemove' , (e) => {
      Store.cursor.x = e.pageX
      Store.cursor.y = e.pageY
    })

    this.pageMenu.setState({
      items: [
        {
          title: 'Open link in new tab',
          visible: false
        },
        {
          type: 'separator',
          visible: false
        },
        {
          title: 'Copy link address',
          visible: false
        },
        {
          title: 'Save link as',
          visible: false
        },
        {
          type: 'separator',
          visible: false
        },
        {
          title: 'Open image in new tab',
          visible: false
        },
        {
          title: 'Save image as',
          visible: false
        },
        {
          title: 'Copy image',
          visible: false
        },
        {
          title: 'Copy image address',
          visible: false
        },
        {
          type: 'separator',
          visible: false
        },
        {
          title: 'Print',
          visible: false
        },
        {
          title: 'Save as',
          visible: false
        },
        {
          type: 'separator',
          visible: false
        },
        {
          title: 'View source',
          visible: false
        },
        {
          title: 'Inspect element'
        }
      ]
    })
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