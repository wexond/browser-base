import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Suggestion from '../Suggestion'

import * as suggestionsActions from '../../actions/suggestions'

import Network from '../../utils/network'

interface Props {

}

interface State {
  visible: boolean,
  suggestions: any[],
  selectedSuggestion: number,
}

@observer
export default class Suggestions extends React.Component<Props, State> {
  
  public lastSearchSuggestions: any[]
  public hidden: boolean
  

  constructor(props: Props) {
    super(props)

    this.state = {
      visible: false,
      suggestions: [],
      selectedSuggestion: 0
    }

    this.lastSearchSuggestions = []
  }

  public hide = () => {
    this.setState({visible: false})
  }

  public show () {
    this.setState({visible: true})
  }

  public suggest = async (text: string) => {
    const historySuggestions = await suggestionsActions.getHistorySuggestions(text)

    this.setState({suggestions: historySuggestions.concat(this.lastSearchSuggestions)})

    if (this.state.suggestions.length === 0) {
      this.hide()
    }

    const toggle = () => {
      if (this.state.suggestions.length === 0) {
        this.hide()
      }
      else {
        if (!this.hidden) { this.show() }
      }
    }

    toggle()

    if (text.indexOf('.') === -1 || text.trim().indexOf(' ') !== -1) {
      const data = await suggestionsActions.getSearchSuggestions(text)

      const suggestions = historySuggestions.concat(data)
      this.setState({suggestions})

      this.lastSearchSuggestions = data

      toggle()
    } else {
      this.setState({suggestions: historySuggestions})
    }
  }

  public getSelectedSuggestion () {
    return this.state.suggestions[this.state.selectedSuggestion]
  }

  public async selectNext () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion + 1 > this.state.suggestions.length - 1)) { selectedSuggestion++ }
    await this.setState({selectedSuggestion})
  }

  public async selectPrevious () {
    let selectedSuggestion = this.state.selectedSuggestion
    if (!(selectedSuggestion - 1 < 0)) { selectedSuggestion-- }
    await this.setState({selectedSuggestion})
  }

  public selectByIndex (index: number) {
    this.setState({selectedSuggestion: index})
  }

  public whatToSuggest = () => {
    if (this.state.suggestions[0] != null && this.state.suggestions[0].type === 'autocomplete-url') {
      return this.state.suggestions[0].url
    }
    return null
  }

  public render (): JSX.Element {
    const {
      visible,
      suggestions
    } = this.state

    const suggestionsStyle = {
      display: (visible) ? 'flex' : 'none'
    }

    const onMouseDown = (e: any) => {
      e.stopPropagation()
    }

    return (
      <div onMouseDown={onMouseDown} style={suggestionsStyle} className='suggestions'>
        {suggestions.map((item, key) => {
          let selected = false
          if (this.state.selectedSuggestion === key) { selected = true }
          return <Suggestion key={key} favicon={item.favicon} type={item.type} title={item.title} description={item.description} url={item.url} selected={selected} hide={this.hide} />
        })}
      </div>
    )
  }
}
