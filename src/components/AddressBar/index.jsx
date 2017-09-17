import Component from 'inferno-component'

import wexondUrls from '../../defaults/wexond-urls'

import { connect } from 'inferno-mobx'

import Store from '../../store'

import Network from '../../utils/network'

@connect
export default class AddressBar extends Component {
  constructor () {
    super()

    this.state = {
      domain: '',
      certificateType: 'Normal',
      certificateName: '',
      inputToggled: false
    }
  }

  componentDidMount () {
    window.addEventListener('mousedown', (e) => {
      if (this.state.inputToggled) this.setInputToggled(false)
      setTimeout(() => {
        this.setURL(this.url)
      }, 200)
    })
  }

  focus = () => {
    this.input.focus()
  }

  setURL = (url) => {
    this.url = url
    // Change URL of input only when the input is not active.
    if (!this.state.inputToggled) this.input.value = (!url.startsWith(wexondUrls.newtab)) ? url : ''
  }

  setInfo = (url) => {
    const domain = Network.getDomain(url)
    
    this.setURL(url)

    this.setState({domain: domain})

    this.setCertificate(url)
  }

  setInputToggled = (flag) => {
    this.setState({inputToggled: flag})
    if (flag) this.focus()
  }

  setCertificate = async (url) => {
    const certificate = await Network.getCertificate(url)
    const tab = Store.tabs.filter(tab => tab.id === Store.selectedTab)[0]

    let certificateName = certificate.title
    
    if (certificate.country != null) {
      certificateName += ' [' + certificate.country + ']'
    }

    if (certificate.name == null && certificate.type === 'Secure') {
      certificateName = 'Secure'
    } else if (certificate.name == null && certificate.type === 'Wexond') {
      certificateName = 'Wexond'
    } else if (certificate.name == null && certificate.type === 'Normal') {
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
      inputToggled,
      domain,
      certificateType,
      certificateName
    } = this.state

    let iconClassName = 'normal'
    if (certificateType === 'Wexond') {
      iconClassName = 'wexond'
    } else if (certificateType === 'Secure') {
      iconClassName = 'secure'
    }

    const onKeyPress = (e) => {
      if (e.which === 13) {
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
      }
    }

    const onClick = (e) => {
      e.stopPropagation()

      if (!this.state.inputToggled) {
        this.setInputToggled(true)
        this.input.setSelectionRange(0, this.input.value.length)
      }
    }

    const infoStyle = {
      opacity: (inputToggled) ? 0 : 1,
      pointerEvents: (inputToggled) ? 'none' : 'auto'
    }

    const addressBarEvents = {
      onMouseDown: (e) => { 
        e.stopPropagation() 
      },
      onClick: onClick
    }

    return (
      <div {...addressBarEvents} className='address-bar'>
        <input onKeyPress={onKeyPress} ref={(r) => { this.input = r }} placeholder='Search'></input>
        <div style={infoStyle} className='info'>
          <div className={'icon ' + iconClassName} />
          <div className='certificate-name'>{certificateName}</div>
          <div className='separator' />
          <div className='domain'>{domain}</div>
        </div>
        <div className='action-icons'>
          <div className='action-icon favorite' />
          <div className='action-icon clear' />
        </div>
      </div>
    )
  }
}
