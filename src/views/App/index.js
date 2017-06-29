import '../../app.scss'
import './global'

import Component from '../../classes/Component'
import UI from '../../classes/UI'

import Tabs from '../../components/Tabs'
import Bar from '../../components/Bar'

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
      </div>
    )
  }

  afterRender() {
    this.elements.tabs.addTab()
  }

  getSelectedTab () {
    return this.elements.tabs.selectedTab
  }

  getSelectedPage () {
    return this.getSelectedTab().page
  }
}

// Wait for sass load.
setTimeout(function () {
  UI.render(<App />, document.getElementById('app'))
}, 1)
