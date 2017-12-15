import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Suggestion from '../Suggestion'

import * as suggestionsActions from '../../actions/suggestions'

import Network from '../../utils/network'

@observer
export default class Suggestions extends React.Component {
  constructor () {
    super()

    this.state = {
      visible: false,
      suggestions: [],
      selectedSuggestion: 0
    }

    this.lastSearchSuggestions = []
  }

  hide = () => {
    this.setState({visible: false})
  }

  show () {
    this.setState({visible: true})
  }

  suggest = async (text) => {
    const historySuggestions = await suggestionsActions.getHistorySuggestions(text)

    this.setState({suggestions: historySuggestions.concat(this.lastSearchSuggestions)})

    const toggle = () => {
      if (this.state.suggestions.length === 0) {
        this.hide()
      }
      else {
        this.show()
      }
    }

    toggle()

    if (text.indexOf('.') === -1 || text.trim().indexOf(' ') !== -1) {
      const data = await suggestionsActions.getSearchSuggestions(text)

      const suggestions = historySuggestions.concat(data)
      this.setState({suggestions: suggestions})

      this.lastSearchSuggestions = data

      toggle()
    } else {
      this.setState({suggestions: historySuggestions})
    }
  }

  getSelectedSuggestion () {
    return this.state.suggestions[this.state.selectedSuggestion]
  }

  async selectNext () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion + 1 > this.state.suggestions.length - 1)) selectedSuggestion++
    await this.setState({selectedSuggestion: selectedSuggestion})
  }

  async selectPrevious () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion - 1 < 0)) selectedSuggestion--
    await this.setState({selectedSuggestion: selectedSuggestion})
  }

  selectByIndex (index) {
    this.setState({selectedSuggestion: index})
  }

  whatToSuggest = () => {
    if (this.state.suggestions[0] != null && this.state.suggestions[0].type === 'autocomplete-url') {
      return this.state.suggestions[0].url
    }
    return null
  }

  render () {
    const {
      visible,
      suggestions
    } = this.state

    const suggestionsStyle = {
      display: (visible) ? 'flex' : 'none'
    }

    const onMouseDown = (e) => {
      e.stopPropagation()
    }

    return (
      <div onMouseDown={onMouseDown} style={suggestionsStyle} className='suggestions'>
        {suggestions.map((item, key) => {
          let selected = false
          if (this.state.selectedSuggestion === key) selected = true
          return <Suggestion key={key} favicon={item.favicon} type={item.type} title={item.title} description={item.description} url={item.url} selected={selected} hide={this.hide} />
        })}
      </div>
    )
  }
}
