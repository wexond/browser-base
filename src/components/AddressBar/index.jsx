import Component from 'inferno-component'

import wexondUrls from '../../defaults/wexond-urls'

import { connect } from 'inferno-mobx'

import Store from '../../store'

import Network from '../../utils/network'

import { getSelectedTab } from '../../actions/tabs'
import { getSelectedPage } from '../../actions/pages'

@connect
export default class AddressBar extends Component {
  constructor () {
    super()

    this.state = {
      domain: '',
      certificateType: 'Normal',
      certificateName: ''
    }

    this.inputToggled = false
    this.lastSuggestion = ''
  }

  componentDidMount () {
    window.addEventListener('mousedown', (e) => {
      this.setInputToggled(false)
      this.setURL(Store.url)
    })
  }

  focus = () => {
    this.input.focus()
  }

  setURL = (url) => {
    Store.url = url
    // Change URL of input only when it's not active.
    if (!this.inputToggled) {
      this.input.value = (!url.startsWith(wexondUrls.newtab)) ? url : ''
    }
  }

  setInfo = (url) => {
    const domain = Network.getDomain(url)

    this.setURL(url)

    this.setState({domain: domain})

    this.setCertificate(url)

    if (url.startsWith(wexondUrls.newtab)) {
      this.setInputToggled(true)
    }
  }

  setInputToggled = (flag, force = false) => {
    if (!flag && !force) {
      // Always have toggled input when the url
      // starts with wexond://newtab.
      if (Store.url.startsWith(wexondUrls.newtab)) return
    }
    
    // Hide or show the info depending on the flag
    // whether it's true or false.
    this.info.style.opacity = (flag) ? 0 : 1
    this.info.style.pointerEvents = (flag) ? 'none' : 'auto'

    // Focus and change input value only when it's toggled.
    if (flag) {
      this.focus()
      this.input.value = (!Store.url.startsWith(wexondUrls.newtab)) ? Store.url : ''
    }

    this.inputToggled = flag
  }

  setCertificate = async (url) => {
    const certificate = await Network.getCertificate(url)
    const tab = getSelectedTab()

    let certificateName = certificate.title
    
    if (certificate.country != null) {
      certificateName += ' [' + certificate.country + ']'
    }

    if (certificate.title == null && certificate.type === 'Secure') {
      certificateName = 'Secure'
    } else if (certificate.title == null && certificate.type === 'Wexond') {
      certificateName = 'Wexond'
    } else if (certificate.title == null && certificate.type === 'Normal') {
      certificateName = ''
    }

    this.setState({
      certificateName: certificateName,
      certificateType: certificate.type
    })

    tab.certificate = {
      type: certificate.type,
      name: certificate.name,
      country: certificate.country
    }
  }

  getSelectionText() {
    let text = ''
    if (window.getSelection) {
        text = window.getSelection().toString()
    } else if (document.selection && document.selection.type !== 'Control') {
        text = document.selection.createRange().text
    }
    return text;
  }

  autoComplete (whatToSuggest, inputText = null) {
    let text = inputText
    if (text == null) text = this.input.value
    const index = whatToSuggest.indexOf(text)
    if (index !== -1) {
      this.input.value = whatToSuggest.substr(index)
      if (this.input.value.length - text.length > 0) {
        this.input.setSelectionRange(text.length, this.input.value.length)
      }
    }
  }

  render () {
    const {
      domain,
      certificateType,
      certificateName
    } = this.state

    const onInput = async (e) => {
      const input = e.currentTarget
      const text = input.value.toLowerCase().trim().replace(this.getSelectionText(), '')

      if (this.canSuggest && text !== '') {
        this.autoComplete(this.lastSuggestion)
      }

      await Store.app.suggestions.suggest(text)

      if (this.canSuggest) {
        const whatToSuggest = Store.app.suggestions.whatToSuggest()
        if (whatToSuggest != null) {
          this.autoComplete(whatToSuggest, input.value.toLowerCase().replace(this.getSelectionText(), ''))
          this.lastSuggestion = whatToSuggest
        }
        this.canSuggest = false
      }
    }

    const onKeyUp = async (e) => {
      // When pressing escape in the input,
      // just toggle it off, and revert its value.
      if (e.which === 27) { // Escape.
        this.setInputToggled(false)
        this.setURL(Store.url)
      }
    }

    const onKeyDown = async (e) => {
      const key = e.keyCode
      // Blacklist: backspace, enter, ctrl, alt, shift, tab, caps lock, delete, space
      if (key != 8 && key != 13 && key != 17 && key != 18 && key != 16 && key != 9 && key != 20 && key != 46 && key != 32) {
        this.canSuggest = true
      }
    }

    const onKeyPress = (e) => {
      // When pressing enter just navigate WebView.
      if (e.which === 13) { // Enter.
        e.preventDefault()

        const page = getSelectedPage()
        const inputText = e.currentTarget.value

        let URLToNavigate = inputText

        if (Network.isURL(e.currentTarget.value)) {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'http://' + inputText
        } else {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'https://www.google.com/search?q=' + inputText
        }

        page.page.webview.loadURL(URLToNavigate)

        // Force toggle off the input.
        this.setInputToggled(false, true)
        
        Store.app.suggestions.hide()
      }
    }

    const onClick = (e) => {
      if (!this.inputToggled) {
        this.setInputToggled(true)
        this.input.setSelectionRange(0, this.input.value.length)
      }
    }

    const addressBarEvents = {
      onMouseDown: (e) => e.stopPropagation() 
    }

    const inputEvents = {
      onKeyPress: onKeyPress,
      onKeyUp: onKeyUp,
      onKeyDown: onKeyDown,
      onInput: onInput
    }

    return (
      <div {...addressBarEvents} className='address-bar'>
        <input {...inputEvents} ref={(r) => { this.input = r }} placeholder='Search'></input>
        <div ref={(r) => { this.info = r }} className='info'>
          <div className={'icon ' + certificateType} />
          <div className={'certificate-name ' + this.state.certificateType}>{certificateName}</div>
          <div className='separator' />
          <div className='click-area' onClick={onClick}>
            <div className='domain'>{domain}</div>
          </div>
        </div>
        
        <div className='action-icons'>
          <div className='action-icon favorite' />
          <div className='action-icon clear' />
        </div>
      </div>
    )
  }
}
