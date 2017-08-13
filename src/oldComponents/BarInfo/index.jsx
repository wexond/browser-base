import Component from '../../component'
import Network from '../../utils/network'

import Store from '../../store'

export default class BarInfo extends Component {
  afterRender () {
    const self = this

    window.addEventListener('mousedown', function (e) {
      if (self.toggled) self.toggleInput(false)
    })
  }

  toggleInput (flag) {
    const self = this

    this.elements.input.setCSS({
      opacity: (flag) ? 1 : 0,
      pointerEvents: (flag) ? 'auto' : 'none'
    })

    clearTimeout(self.timeout)

    if (!flag) {
      self.timeout = setTimeout(() => {
        self.elements.actionIcons.setCSS({
          float: 'none',
          position: 'absolute',
          marginRight: 0
        })
      }, 200)
    } else {
      self.elements.actionIcons.setCSS({
        float: 'right',
        position: 'relative',
        marginRight: 11
      })
      this.elements.input.focus()
    }

    this.elements.actionIcons.setCSS({
      opacity: (flag) ? 1 : 0,
      pointerEvents: (flag) ? 'auto' : 'none'
    })

    this.toggled = flag
  }
  
  setCertificate = (type, tab, name = null, country = null) => {
    let certificateName = name
    if (country != null) {
      certificateName += ' [' + country + ']'
    }

    if (tab.selected) {
      this.elements.icon.setCSS({
        marginRight: 12
      })
    }

    if (name == null && type === 'Secure') {
      certificateName = 'Secure'
    } else if (name == null && type === 'Wexond') {
      certificateName = 'Wexond'
    } else if (name == null && type === 'Normal') {
      certificateName = ''
      if (tab.selected) {
        this.elements.icon.setCSS({
          marginRight: 0
        })
      }
    }

    if (tab.selected) {
      this.elements.icon.classList.remove('bar-info-icon-normal')
      this.elements.icon.classList.remove('bar-info-icon-wexond')
      this.elements.icon.classList.remove('bar-info-icon-secure')
      if (type === 'Secure') {
        this.elements.icon.classList.add('bar-info-icon-secure')
        this.elements.certificateInfo.setCSS({ color: 'green' })
      } else if (type === 'Wexond') {
        this.elements.icon.classList.add('bar-info-icon-wexond')
        this.elements.certificateInfo.setCSS({ color: '#2196F3' })
      } else if (type === 'Normal') {
        this.elements.certificateInfo.setCSS({ color: 'black' })
        this.elements.icon.classList.add('bar-info-icon-normal')
      }
    }

    tab.certificate = {
      type: type,
      name: name,
      country: country
    }

    if (tab.selected) {
      this.elements.certificateInfo.textContent = certificateName
    }
  }

  setDomain = (url) => {
    this.elements.domain.textContent = Network.getDomain(url)
  }

  setURL = (url) => {
    if (!this.toggled) {
      this.elements.input.value = url
    }

    this.setDomain(url)
  }

  updateInfo = (url, tab) => {
    const self = this

    this.setCertificate('Normal', tab)

    if (tab.selected) {
      this.setURL(url)
      this.setDomain(url)
    }

    Network.getCertificate(url, (data) => {
      self.setCertificate(data.type, tab, data.title, data.country)
    })
  }

  render () {
    const self = this

    const onActionIconsMouseDown = (e) => {
      e.stopPropagation()
    }

    const onInputMouseDown = (e) => {
      e.stopPropagation()
    }

    const onMouseEnter = () => {
      self.elements.actionIcons.setCSS({
        opacity: 1,
        pointerEvents: 'auto'
      })
    }

    const onMouseLeave = () => {
      if (!self.toggled) {
        self.elements.actionIcons.setCSS({
          opacity: 0,
          pointerEvents: 'none'
        })
      }
    }

    const onClearClick = () => {
      self.elements.input.value = ''
      if (!self.toggled) {
        self.toggleInput(true)
      }
      self.elements.input.focus()
    }

    const onDomainClick = (e) => {
      e.stopPropagation()
      if (!self.toggled) {
        self.setURL(Store.app.getSelectedPage().elements.webview.getURL())
        self.toggleInput(true)
      }
    }

    const onInputFocus = () => {
      self.elements.input.setSelectionRange(0, self.elements.input.value.length)
    }

    const onInputKeyPress = (e) => {
      if (e.which === 13) {
        e.preventDefault()
        const page = Store.app.getSelectedPage()
        const webview = page.elements.webview
        const inputText = self.elements.input.value

        let URLToNavigate = inputText

        if (Network.isURL(e.currentTarget.value)) {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'http://' + inputText
        } else {
          if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'https://www.google.com/search?q=' + inputText
        }

        webview.loadURL(URLToNavigate)

        Store.app.getSelectedTab().getWebView().loadURL(self.elements.input.value)

        self.toggleInput(false)
      }
    }

    return (
      <div ref='barInfo' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className='bar-info'>
        <div ref='icon' className='bar-info-icon' />
        <div ref='certificateInfo' className='bar-info-certificate-info' />
        <div className='bar-info-divider' />
        <div ref='domain' onClick={onDomainClick} className='bar-info-domain' />
        <div ref='actionIcons' onMouseDown={onActionIconsMouseDown} className='bar-info-action-icons'>
          <div ref='favorite' className='bar-info-action-icon-favorite' />
          <div ref='clear' onClick={onClearClick} className='bar-info-action-icon-clear' />
        </div>
        <input ref='input' onMouseDown= {onInputMouseDown} onFocus={onInputFocus} onKeyPress={onInputKeyPress} className='bar-info-input' />
      </div>
    )
  }
}