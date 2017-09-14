import Component from 'inferno-component'

import wexondUrls from '../../defaults/wexond-urls'

import { connect } from 'inferno-mobx'

import Store from '../../store'

import { isURL } from '../../actions/network'

@connect
export default class AddressBar extends Component {
  constructor () {
    super()

    this.state = {
      url: ''
    }
  }

  focus = () => {
    this.input.focus()
  }

  setURL = (url) => {
    if (!url.startsWith(wexondUrls.newtab)) {
      this.setState({url: url})
    } else {
      this.setState({url: ''})
    }
  }

  render () {
    const onKeyPress = (e) => {
      if (e.which === 13) {
        e.preventDefault()
        const page = Store.pages.filter(page => Store.selectedTab === page.id)[0]
        const inputText = e.currentTarget.value

        let URLToNavigate = inputText

        if (isURL(e.currentTarget.value)) {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'http://' + inputText
        } else {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'https://www.google.com/search?q=' + inputText
        }
      
        console.log(URLToNavigate)

        page.webview.loadURL(URLToNavigate)
      }
    }

    return (
      <div className='address-bar'>
        <input onKeyPress={onKeyPress} ref={(r) => { this.input = r }} placeholder='Search' value={this.state.url}></input>
      </div>
    )
  }
}