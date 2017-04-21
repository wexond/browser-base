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
  selectSuggestion = (moveBy) => {
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
  selectSuggestionByIndex = (index) => {
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

    this.updateBar()

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
   * shows suggestions
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
   */
  setText = (text) => {
    this.lastText = text
    if (this.input !== document.activeElement) this.input.value = text
    this.updateBar()
  }
  /**
   * Updates bar.
   * @param {boolean} toggleSuggestions
   */
  updateBar = (toggleSuggestions = false) => {
    if (this.input.value === '') {
      this.removeHint()
      if (toggleSuggestions) {
        this.hideSuggestions()
      }
    }
  }
  /**
   * Auto completes input with given text.
   * @param {DOMElement} input
   * @param {string} text - text to autocomplete
   */
  autoComplete = (text) => {
    var inputText = this.input.value
    if (text != null || text !== '') {
      if (text.toLowerCase().indexOf(inputText.toLowerCase()) !== -1) {
        var hintText = text.replace(inputText.toLowerCase(), inputText).substr(text.indexOf(inputText[0]))
        this.setState({hint: hintText})
        this.suggestedURL = text
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
      self.setState({inputText: e.currentTarget.value}, function () {
        self.setState({hintOverflowWidth: self.refs.textWidth.offsetWidth})
      })

      self.updateBar(true)

      var suggestions = []

      self.showSuggestions()

      let allSuggestions = suggestions.slice()
      let firstItem = {
        type: 'info',
        url: self.input.value,
        hint: 'Search in Google'
      }

      if (self.previousHistorySuggestions != null && !(self.previousHistorySuggestions.length <= 0)) {
        for (var i = 0; i < self.previousHistorySuggestions.length; i++) {
          allSuggestions.push(self.previousHistorySuggestions[i])
        }
      } else {
        suggestions.push(firstItem)
        allSuggestions.push(firstItem)
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
          suggestions[0] = {type: 'separator', text: 'History'}
          historySuggestions.push({type: 'separator', text: 'History'})
        } else {
          if (suggestions[0] !== firstItem) {
            suggestions.push(firstItem)
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

        if (suggestions[1] != null) {
          self.autoComplete(suggestions[1].url)
        } else {
          self.removeHint()
        }

        if (self.barVisible) {
          self.showSuggestions()
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
      // arrow up
      if (key === 38) {
        self.removeHint()
        self.selectSuggestion(-1)
        e.preventDefault()
      }
      // arrow down
      if (key === 40) {
        self.removeHint()
        self.selectSuggestion(1)
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
