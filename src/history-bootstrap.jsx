import './history.scss'

import Inferno from 'inferno'

import History from './components/History'

// Wait for sass load.
setTimeout(function () {
  Inferno.render(<History />, document.getElementById('app'))
}, 1)
