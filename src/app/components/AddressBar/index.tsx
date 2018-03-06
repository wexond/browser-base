import React from 'react'

import wexondUrls from '../../defaults/wexond-urls'

import { observer } from 'mobx-react'

import Store from '../../store'

import Network from '../../utils/network'

import * as filesActions from '../../actions/files'
import * as pagesActions from '../../actions/pages'
import * as tabsActions from '../../actions/tabs'

import * as suggestionsActions from '../../actions/suggestions';
import Storage from '../../utils/storage'

interface Props {

}

interface State {
  domain: string,
  certificateType: string,
  certificateName: string,
}

@observer
export default class AddressBar extends React.Component<Props, State> {

  public canSuggest: boolean
  public inputToggled: boolean
  public lastSuggestion: string

  public input: HTMLInputElement
  public info: HTMLDivElement

  constructor(props: Props) {
    super(props)

    this.state = {
      domain: '',
      certificateType: 'Normal',
      certificateName: ''
    }

    this.inputToggled = false
    this.lastSuggestion = ''
  }

  public componentDidMount() {
    window.addEventListener('mousedown', (e) => {
      this.setInputToggled(false)
      this.setURL(Store.url)
    })
  }

  public focus = () => {
    this.input.focus()
  }

  public setURL = (url: string): void => {
    Store.url = url
    // Change URL of input only when it's not active.
    if (!this.inputToggled) {
      this.input.value = (!url.startsWith(wexondUrls.newtab)) ? url : ''
    }
  }

  public setInfo = (url: string): void => {
    const domain = Network.getDomain(url)

    this.setURL(url)

    this.setState({ domain })

    this.setCertificate(url)

    if (url.startsWith(wexondUrls.newtab)) {
      this.setInputToggled(true)
    }
  }

  public setInputToggled = (flag: boolean, force = false): void => {
    if (!flag && !force) {
      // Always have toggled input when the url
      // starts with wexond://newtab.
      if (Store.url.startsWith(wexondUrls.newtab)) { return }
    }

    // Hide or show the info depending on the flag
    // whether it's true or false.
    this.info.style.display = (flag) ? 'none' : 'flex'
    this.input.style.display = (flag) ? 'block' : 'none'

    // Focus and change input value only when it's toggled.
    if (flag) {
      this.focus()
      this.input.value = (!Store.url.startsWith(wexondUrls.newtab)) ? Store.url : ''
    }

    this.inputToggled = flag
  }

  public setCertificate = async (url: string) => {
    const tab = tabsActions.getSelectedTab()
    if (tab.certificate != null) {
      this.setState({
        certificateName: tab.certificate.name,
        certificateType: tab.certificate.type
      })
    }

    const certificate = await Network.getCertificate(url)

    let certificateName = certificate.title

    if (certificate.country != null) {
      certificateName += ' [' + certificate.country + ']'
    }

    if (certificate.title == null && certificate.type === 'Secure') {
      certificateName = Store.dictionary.security.secure
    } else if (certificate.title == null && certificate.type === 'Wexond') {
      certificateName = 'Wexond'
    } else if (certificate.title == null && certificate.type === 'Normal') {
      certificateName = ''
    }

    this.setState({
      certificateName,
      certificateType: certificate.type
    })

    tab.certificate = {
      type: certificate.type,
      name: certificate.name,
      country: certificate.country
    }
  }

  public getSelectionText(): string {
    let text = ''
    if (window.getSelection) {
      text = window.getSelection().toString()
    } else if (document.selection && document.selection.type !== 'Control') {
      text = document.selection.createRange().text
    }
    return text;
  }

  public autoComplete(whatToSuggest, text: string) {
    if (whatToSuggest.type !== 'autocomplete-url') { return }

    const suggestion = whatToSuggest.title

    const httpsRegex = /(http(s?)):\/\//gi
    const wwwRegex = /(www.)?/gi

    if (suggestion.replace(httpsRegex, '').replace(wwwRegex, '')
      .startsWith(text.replace(wwwRegex, '').replace(httpsRegex, ''))
      && text.replace(wwwRegex, '').replace(httpsRegex, '') !== '') {
      this.input.value = text + suggestion.replace(httpsRegex, '').replace(wwwRegex, '')
      this.input.value = this.input.value.replace(text.replace(wwwRegex, '').replace(httpsRegex, ''), '')
    }

    if (this.input.value.length - text.length > 0) {
      this.input.setSelectionRange(text.length, this.input.value.length)
    }
  }

  public render() {
    const {
      domain,
      certificateType,
      certificateName
    } = this.state

    const onInput = async (e) => {
      const input = e.currentTarget
      const text = input.value.toLowerCase().trim()

      Store.app.suggestions.hidden = false

      Store.app.suggestions.selectByIndex(0)

      Store.app.suggestions.show()

      if (this.canSuggest && this.lastSuggestion != null) {
        this.autoComplete(this.lastSuggestion, text)
      }

      if (this.canSuggest) {
        const whatToSuggest = await suggestionsActions.getHistorySuggestions(text)

        if (whatToSuggest[0] != null) {
          this.autoComplete(whatToSuggest[0], text)
          this.lastSuggestion = whatToSuggest[0]
        }

        this.canSuggest = false
      }

      await Store.app.suggestions.suggest(text)
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

      const setNewValue = (suggestion) => {
        if (suggestion.type === 'history') {
          this.input.value = suggestion.url
        } else if (suggestion.type === 'search'
          || suggestion.type === 'unknown-search'
          || suggestion.type === 'unknown-url'
          || suggestion.type === 'autocomplete-url') {
          this.input.value = suggestion.title
        }
      }

      if (key === 40) {
        e.preventDefault()

        await Store.app.suggestions.selectNext()
        const suggestion = Store.app.suggestions.getSelectedSuggestion()

        setNewValue(suggestion)
      }
      if (key === 38) {
        e.preventDefault()

        await Store.app.suggestions.selectPrevious()
        const suggestion = Store.app.suggestions.getSelectedSuggestion()

        setNewValue(suggestion)
      }
    }

    const onKeyPress = (e) => {
      // When pressing enter just navigate WebView.
      if (e.which === 13) { // Enter.
        e.preventDefault()

        const page = pagesActions.getSelectedPage()
        const tab = tabsActions.getSelectedTab()
        const inputText = e.currentTarget.value

        let URLToNavigate = inputText

        if (Network.isURL(e.currentTarget.value)) {
          if (e.currentTarget.value.indexOf('://') === -1) { URLToNavigate = 'http://' + inputText }
        } else {
          if (e.currentTarget.value.indexOf('://') === -1) { URLToNavigate = 'https://www.google.com/search?q=' + inputText }
        }

        page.page.webview.loadURL(URLToNavigate)
        page.page.webview.focus()

        // Force toggle off the input.
        this.setInputToggled(false, true)

        Store.app.suggestions.hide()
        Store.app.suggestions.hidden = true
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
      onKeyPress,
      onKeyUp,
      onKeyDown,
      onInput
    }

    const search = Store.dictionary.searching.search

    return (
      <div { ...addressBarEvents } className={ 'address-bar ' + Store.foreground }>
        <input { ...inputEvents } ref={ (r) => { this.input = r } } placeholder={ search }></input>
        <div ref={ (r) => { this.info = r } } className='info'>
          <div className={ 'icon ' + certificateType } />
          <div className={ 'certificate-name ' + this.state.certificateType }>{ certificateName }</div>
          <div className='separator' />
          <div className='click-area' onClick={ onClick }>
            <div className='domain'>{ domain }</div>
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
