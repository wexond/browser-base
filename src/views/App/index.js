import '../../app.scss'
import './global'

import Component from '../../classes/Component'
import UI from '../../classes/UI'

import Tabs from '../../components/Tabs'
import Bar from '../../components/Bar'
import ContextMenu from '../../components/ContextMenu'

class App extends Component {
  constructor() {
    super()
  }

  beforeRender() {
    window.app = this

    this.cursor = {}
  }

  render() {
    return (
      <div>
        <Tabs ref='tabs' />
        <Bar ref='bar' />
        <div className='pages' ref='pages' />
        <ContextMenu ref='webviewMenu' />
      </div>
    )
  }

  afterRender() {
    const self = this
    this.elements.tabs.addTab()

    window.addEventListener('mousedown', (e) => {
      self.elements.webviewMenu.hide()
    })

    this.elements.webviewMenu.updateItems(
      [
        {
          title: 'Open link in new tab',
          show: false
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Copy link address',
          show: false
        },
        {
          title: 'Save link as',
          show: false
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Open image in new tab',
          show: false
        },
        {
          title: 'Save image as',
          show: false
        },
        {
          title: 'Copy image',
          show: false
        },
        {
          title: 'Copy image address',
          show: false
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'Print',
          show: false
        },
        {
          title: 'Save as',
          show: false
        },
        {
          title: 'Separator',
          show: false
        },
        {
          title: 'View source',
          show: false
        },
        {
          title: 'Inspect element'
        }
      ]
    )
  }

  getSelectedTab() {
    return this.elements.tabs.selectedTab
  }

  getSelectedPage() {
    return this.getSelectedTab().page
  }
}

// Wait for sass load.
setTimeout(function () {
  UI.render(<App />, document.getElementById('app'))
}, 1)
