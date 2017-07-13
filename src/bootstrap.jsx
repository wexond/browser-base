import './app.scss'

import App from './components/App'
import Component from './component'
import UI from './ui'

// Wait for sass load.
setTimeout(function () {
  UI.render(<App />, document.getElementById('app'))
}, 1)