import '../../app.scss'
import './global'
import Tabs from '../../components/Tabs'
import Component from '../../classes/Component'
import UI from '../../classes/UI'

class App extends Component {
  constructor() {
    super()
  }

  beforeRender() {
    window.app = this
    this.cursor = {}
  }

  render() {
    return {
      children: [
        {
          component: new Tabs()
        },
        {
          tag: 'div',
          props: { className: 'pages' },
          ref: 'pages'
        }
      ]
    }
  }

  afterRender() {
    // this.elements.tabs.addTab()
  }
}

// Wait for sass load.
setTimeout(function () {
  UI.render(new App(), document.getElementById('app'))
}, 1)
