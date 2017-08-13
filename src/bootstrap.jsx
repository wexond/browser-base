import './app.scss'

import Inferno from 'inferno'

import App from './components/App'

// Wait for sass load.
setTimeout(function () {
  Inferno.render(<App />, document.getElementById('app'))
}, 1)