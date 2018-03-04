import '../new-tab.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import NewTab from '../components/NewTab'

// Wait for sass load.
setTimeout(function () {
  ReactDOM.render(<NewTab />, document.getElementById('app'))
}, 1)
