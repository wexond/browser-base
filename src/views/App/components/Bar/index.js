import React from 'react'
import Suggestion from './components/Suggestion'
import Suggestions from '../../../../helpers/Suggestions'
import Network from '../../../../helpers/Network'

export default class Bar extends React.Component {
  constructor () {
    super()

    this.state = {
      barMarginTop: -20,
      barTop: 42,
      barOpacity: 0,
      suggestionsOpacity: 0,
      suggestionsToCreate: [],
      suggestionsPointerEvents: 'none',
      hint: '',
      barPointerEvents: false,
      barCenter: true,
      hintOverflowWidth: 0,
      inputText: ''
    }

    this.tempLocked = false
    this.locked = true

    this.canSuggest = false
    this.suggestions = []

    this.input = null
    this.lastText = ''

    this.barVisible = false
    this.suggestionsVisible = false

    this.suggestedURL = ''
  }

  componentDidMount () {
    var self = this
    document.body.addEventListener('mousemove', function (e) {
      if (e.pageY > 120 && !self.locked && !self.tempLocked && self.barVisible) {
        self.hide()
      }
      if (e.pageY <= 32 && !self.barVisible) {
        self.show()
      }
    })
    this.show()

    window.addEventListener('resize', function () {
      if (window.innerWidth < 640) {
        self.setState({barCenter: false})
      } else {
        self.setState({barCenter: true})
      }
    })
  }

  /**
   * Gets selected suggestions.
   * @return {Suggestion}
   */
  getSelectedSuggestion = () => {
    var suggestions = this.suggestions
    for (var i = 0; i < suggestions.length; i++) {
      if (suggestions[i].state.selected) {
        return suggestions[i]
      }
    }
    return null
  }

  /**
   * Moves to next or previous suggestion.
   * @param {number} moveBy
   */
  moveSuggestion = (moveBy) => {
    if (!this.suggestionsVisible) {
      return
    }

    var suggestions = this.suggestions
    var selectedSuggestion = this.getSelectedSuggestion()
    var selectedIndex = suggestions.indexOf(selectedSuggestion)

    if (selectedSuggestion == null) {
      if (suggestions[0] != null) {
        suggestions[0].setState({selected: true})
      }
    } else {
      if (suggestions[selectedIndex + moveBy] != null) {
        for (var i = 0; i < suggestions.length; i++) {
          suggestions[i].setState({selected: false})
        }
        suggestions[selectedIndex + moveBy].setState({selected: true})
        this.input.value = suggestions[selectedIndex + moveBy].state.url
      }
    }
  }

  /**
   * Selects suggestion by index.
   * @param {number} index
   */
  selectSuggestion = (index) => {
    var suggestions = this.suggestions
    if (suggestions[index] != null) {
      for (var i = 0; i < suggestions.length; i++) {
        suggestions[i].setState({selected: false})
      }
      suggestions[index].setState({selected: true})
    }
  }

  /**
   * Shows bar.
   */
  show = () => {
    this.setState({
      barPointerEvents: 'auto',
      barOpacity: 1,
      barMarginTop: 0
    })

    this.barVisible = true
  }

  /**
   * Hides bar.
   */
  hide = () => {
    this.setState({
      barOpacity: 0,
      barMarginTop: -20,
      barPointerEvents: 'none'
    })

    this.input.value = this.lastText
    this.removeHint()
    this.input.blur()

    this.barVisible = false
    this.tempLocked = false

    this.hideSuggestions()
  }

  /**
   * Hides suggestions.
   */
  hideSuggestions = () => {
    this.setState({
      suggestionsOpacity: 0,
      suggestionsPointerEvents: 'none'
    })

    this.suggestionsVisible = false
  }

  /**
   * Shows suggestions.
   */
  showSuggestions = () => {
    if (!this.barVisible) {
      return
    }

    this.setState({
      suggestionsOpacity: 1,
      suggestionsPointerEvents: 'auto'
    })

    this.tempLocked = true
    this.suggestionsVisible = true
  }

  /**
   * Sets text.
   * @param {string} text
   * @param {boolean} overrideActive
   */
  setText = (text, overrideActive) => {
    this.lastText = text
    if (!overrideActive) {
      this.input.value = text
    } else {
      if (this.input !== document.activeElement) this.input.value = text
    }

    if (text === '') {
      this.removeHint()
    }
  }

  /**
   * Auto completes input with given text.
   * @param {DOMElement} input
   * @param {string} text - text to autocomplete
   */
  autoComplete = (text) => {
    let inputText = this.input.value
    let inputTextLower = inputText.toLowerCase()
    let textLower = text.toLowerCase()
    if (textLower != null || textLower !== '') {
      let textToComplete = ''
      let canAutoComplete = false
      let regex = /(http(s?)):\/\/(www.)?/gi

      if (textLower.startsWith(inputTextLower)) {
        textToComplete = textLower.replace(inputTextLower, inputText)
        canAutoComplete = true
      }

      if (textLower.replace(regex, '').startsWith(inputTextLower)) {
        textToComplete = textLower.replace(inputTextLower, inputText).replace(regex, '')
        canAutoComplete = true
      }

      if (canAutoComplete) {
        this.setState({hint: textToComplete})
        this.suggestedURL = textToComplete
      } else {
        this.removeHint()
      }
    }
  }
  /**
   * Removes suggested text from input.
   */
  removeHint = () => {
    this.setState({hint: ''})
    this.suggestedURL = ''
  }
  /**
   * Shows and focuses bar.
   */
  focus = () => {
    this.show()
    this.input.focus()
  }
  /**
   * Gets bar.
   * @return {Bar}
   */
  getBar = () => {
    return this
  }
  /**
   * Gets text.
   * @return {string}
   */
  getText = () => {
    return this.lastText
  }

  render () {
    const self = this

    let inputEvents = {
      onKeyDown: onKeyDown,
      onChange: onChange,
      onFocus: onFocus
    }

    /** Events */

    function onChange (e) {
      let inputText = e.currentTarget.value

      self.setState({inputText: inputText}, function () {
        self.setState({hintOverflowWidth: self.refs.textWidth.offsetWidth})
      })

      var suggestions = []

      if (inputText.trim() !== '') {
        self.showSuggestions()
      } else {
        self.hideSuggestions()
        self.removeHint()
        return
      }

      let allSuggestions = suggestions.slice()
      let infoSearchItem = {
        type: 'info',
        url: inputText,
        hint: 'Search in Google'
      }
      let infoUrlItem = {
        type: 'info-url',
        url: inputText
      }
      let isInputTextURL = false

      if (self.previousHistorySuggestions != null && !(self.previousHistorySuggestions.length <= 0)) {
        for (var i = 0; i < self.previousHistorySuggestions.length; i++) {
          allSuggestions.push(self.previousHistorySuggestions[i])
        }
      } else {
        if (Network.isURL(inputText)) {
          isInputTextURL = true
        } else {
          isInputTextURL = false
          if (Network.isURL('http://' + inputText)) {
            isInputTextURL = true
          }
        }
        if (isInputTextURL) {
          suggestions.push(infoUrlItem)
          allSuggestions.push(infoUrlItem)
        }
        suggestions.push(infoSearchItem)
        allSuggestions.push(infoSearchItem)
      }

      if (self.previousSearchSuggestions != null) {
        for (i = 0; i < self.previousSearchSuggestions.length; i++) {
          allSuggestions.push(self.previousSearchSuggestions[i])
        }
      }

      self.setState({suggestionsToCreate: []})
      self.setState({suggestionsToCreate: allSuggestions})

      Suggestions.getHistorySuggestions(self.input, function (data) {
        let historySuggestions = []

        if (!(data.length <= 0)) {
          suggestions.splice(suggestions.indexOf(infoUrlItem), 1)
          suggestions.splice(suggestions.indexOf(infoSearchItem), 1)
          suggestions.push({type: 'separator', text: 'History'})
          historySuggestions.push({type: 'separator', text: 'History'})
        } else {
          if (suggestions.indexOf(infoSearchItem) === -1) {
            suggestions.push(infoSearchItem)
          }
          if (isInputTextURL && suggestions.indexOf(infoUrlItem) === -1) {
            suggestions.push(infoUrlItem)
          }
        }

        for (var i = 0; i < data.length; i++) {
          var object
          if (data[i].url.indexOf('?q=') === -1) {
            object = {
              type: 'history',
              url: data[i].url,
              title: data[i].title
            }
            suggestions.push(object)
            historySuggestions.push(object)
          }
        }

        if (suggestions[1] != null && self.canSuggest) {
          self.autoComplete(suggestions[1].url)
        } else {
          self.removeHint()
        }

        let allSuggestions = suggestions.slice()

        if (self.previousSearchSuggestions != null) {
          for (i = 0; i < self.previousSearchSuggestions.length; i++) {
            allSuggestions.push(self.previousSearchSuggestions[i])
          }
        }

        self.previousHistorySuggestions = historySuggestions

        self.setState({suggestionsToCreate: allSuggestions})

        Suggestions.getSearchSuggestions(self.input, function (data, error) {
          let searchSuggestions = []
          if (!(data.length <= 0)) {
            suggestions.push({type: 'separator', text: 'Google search'})
            searchSuggestions.push({type: 'separator', text: 'Google search'})
          }

          if (!error) {
            for (var i = 0; i < data.length; i++) {
              var object = {
                type: 'search',
                title: data[i],
                url: data[i]
              }
              suggestions.push(object)
              searchSuggestions.push(object)
            }
          }

          self.previousSearchSuggestions = searchSuggestions

          self.setState({suggestionsToCreate: []})
          self.setState({suggestionsToCreate: suggestions})
        })
      })
    }

    function onSuggestionsClick () {
      self.hideSuggestions()
    }

    function onKeyDown (e) {
      var key = e.keyCode || e.charCode
      // backspace
      if (key === 8) {
        self.canSuggest = false
        self.removeHint()
      } else {
        self.canSuggest = true
      }
      // arrow up
      if (key === 38) {
        self.removeHint()
        self.moveSuggestion(-1)
        e.preventDefault()
      }
      // arrow down
      if (key === 40) {
        self.removeHint()
        self.moveSuggestion(1)
        e.preventDefault()
      }
      // arrow right
      if (key === 39) {
        if (self.suggestedURL !== '') {
          self.input.value = self.suggestedURL
          self.removeHint()
        }
      }
      // enter
      if (key === 13) {
        e.preventDefault()
        if (self.suggestedURL !== '') {
          self.input.value = self.suggestedURL
          self.removeHint()
        }
        for (var i = 0; i < global.tabs.length; i++) {
          if (global.tabs[i].selected) {
            var webview = global.tabs[i].getPage().getWebView()
            if (!e.currentTarget.value.startsWith('wexond://')) {
              if (Network.isURL(e.currentTarget.value)) {
                webview.loadURL(e.currentTarget.value)
              } else {
                if (Network.isURL('http://' + e.currentTarget.value)) {
                  webview.loadURL('http://' + e.currentTarget.value)
                } else {
                  webview.loadURL('https://www.google.com/search?q=' + e.currentTarget.value)
                }
              }
            } else {
              webview.loadURL(e.currentTarget.value)
            }
          }
        }
        self.tempLocked = false
        self.locked = false
        self.hide()
        self.hideSuggestions()
      }
    }

    function onFocus () {
      self.input.setSelectionRange(0, self.input.value.length)
      self.tempLocked = true
    }

    return (
      <div>
        <div style={{
          marginTop: this.state.barMarginTop,
          opacity: this.state.barOpacity,
          pointerEvents: this.state.barPointerEvents
        }} className={(this.state.barCenter) ? 'bar bar-center' : 'bar bar-small-screen'}>
          <div className='bar-search-icon' />
          <div ref='textWidth' className='bar-text-width'>{this.state.inputText}</div>
          <div className='bar-hint' style={{marginLeft: this.state.hintLeft}}>{this.state.hint}</div>
          <div className='bar-hint-overflow' style={{width: this.state.hintOverflowWidth}} />
          <input placeholder='Search' ref={(t) => {
            this.input = t
          }} {...inputEvents} className='bar-input' />
        </div>
        <div onClick={onSuggestionsClick} className='suggestions' style={{
          opacity: this.state.suggestionsOpacity,
          pointerEvents: this.state.suggestionsPointerEvents
        }}>
          {this.state.suggestionsToCreate.map((object, i) => {
            if (object.type !== 'separator') {
              return <Suggestion getBar={self.getBar} key={i} data={object} />
            } else {
              return <div key={i} className='suggestions-separator'>{object.text}</div>
            }
          })}
        </div>
      </div>
    )
  }
}
