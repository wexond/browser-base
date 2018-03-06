import React from 'react'

import Input from '../../Material/Input'
import Ripple from '../../Material/Ripple'

interface Props {
  title: string,
  selectedItems?: any[],
  onSearch?: any,
  onCancel?: any,
  onDelete?: any,
}

interface State {
  searchInput: boolean,
}

export default class ToolBar extends React.Component<Props, State> {
  
  private input: Input

  public static defaultProps = {
    title: 'Title'
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      searchInput: false
    }
  }

  private onSearchIconClick = () => {
    this.setState({searchInput: !this.state.searchInput})

    if (!this.state.searchInput) {
      setTimeout(() => {
        this.input.input.focus()
      }, 64)
    } else {
      this.props.onSearch(this.input.getValue())
    }
  }

  private onSearchCancelIconClick = () => {
    if (this.state.searchInput) {
      this.setState({searchInput: false})
      this.input.setValue('')
    }
  }

  public onInputKeyPress = (e: any) => {
    // Enter
    if (e.which === 13) {
      this.props.onSearch(this.input.getValue())
    }
  }

  public render (): JSX.Element {
    const {
      title,
      selectedItems,
      onSearch,
      onCancel,
      onDelete
    } = this.props

    const actions = window.dictionary.actions
    const searching = window.dictionary.searching

    return (
      <div className='settings-toolbar'>
        <div className='normal-toolbar'>
          <div className='title'>
            {title}
          </div>
          <div className={'search-container' + (this.state.searchInput ? ' selected' : '')}>
            <div className='search-icon' onClick={this.onSearchIconClick}>
              <Ripple center={true} opacity={0.2} />
            </div>
            <Input ref={(r: Input) => this.input = r} placeholder={searching.search} onKeyPress={this.onInputKeyPress} />
            <div className='cancel-icon' onClick={this.onSearchCancelIconClick}>
              <Ripple center={true} opacity={0.2} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}