import Component from 'inferno-component'

import wexondUrls from '../../defaults/wexond-urls'

import { connect } from 'inferno-mobx'

import Store from '../../store'

import Network from '../../utils/network'

import { getSelectedTab } from '../../actions/tabs'

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
    // Change URL of input only when the input is not active.
    if (!this.inputToggled) {
      this.input.value = (!url.startsWith(wexondUrls.newtab)) ? url : ''
    }
  }

  setInfo = (url) => {
    const domain = Network.getDomain(url)

    this.setURL(url)

    this.setState({domain: domain})

    this.setCertificate(url)
  }

  setInputToggled = (flag) => {
    if (!flag) {
      if (Store.url.startsWith(wexondUrls.newtab)) return
    }
    
    this.info.style.opacity = (flag) ? 0 : 1
    this.info.style.pointerEvents = (flag) ? 'none' : 'auto'

    if (flag) {
      this.focus()
      this.input.value = (!Store.url.startsWith(wexondUrls.newtab)) ? Store.url : ''
    }

    this.inputToggled = flag
  }

  setCertificate = async (url) => {
    const certificate = await Network.getCertificate(url)
    const tab = Store.tabs.filter(tab => tab.id === Store.selectedTab)[0]

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

  render () {
    const {
      domain,
      certificateType,
      certificateName
    } = this.state

    const onInput = (e) => {
      if (e.currentTarget.value !== '') {
        Store.app.suggestions.show()
      } else {
        Store.app.suggestions.hide()
      }
    }

    const onKeyUp = (e) => {
      if (e.which === 27) { // Escape.
        this.setInputToggled(false)
        this.setURL(Store.url)
      } 
    } 

    const onKeyPress = (e) => {
      if (e.which === 13) { // Enter.
        e.preventDefault()

        const page = Store.pages.filter(page => Store.selectedTab === page.id)[0]
        const inputText = e.currentTarget.value

        let URLToNavigate = inputText

        if (Network.isURL(e.currentTarget.value)) {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'http://' + inputText
        } else {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'https://www.google.com/search?q=' + inputText
        }

        page.webview.loadURL(URLToNavigate)

        this.setInputToggled(false)

        Store.app.suggestions.hide()
      }
    }

    const onClick = (e) => {
      e.stopPropagation()

      if (!this.inputToggled) {
        this.setInputToggled(true)
        this.input.setSelectionRange(0, this.input.value.length)
      }
    }

    const addressBarEvents = {
      onMouseDown: (e) => { 
        e.stopPropagation() 
      }
    }

    const inputEvents = {
      onKeyPress: onKeyPress,
      onKeyUp: onKeyUp,
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
