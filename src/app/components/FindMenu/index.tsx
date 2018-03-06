import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Colors from '../../utils/colors'
import Storage from '../../utils/storage'

import * as filesActions from '../../actions/files'
import * as tabsActions from '../../actions/tabs'
import * as webviewActions from '../../actions/webview'

import Input from '../../../Material/Input'

interface Props {

}

interface State {
  isOpen: boolean,
}

@observer
export default class FindMenu extends React.Component {

  public input: Input
  constructor(props: Props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }

  public last() {
    this.props.webview.findInPage(input.value, {
      forward: false,
      findNext: true,
    })
  }

  public next() {
    this.props.webview.findInPage(input.value, {
      forward: true,
      findNext: true,
    })
  }

  public toggle() {
    const { webview } = this.props
    const { isOpen } = this.state

    if (isOpen) {
      webview.stopFindInPage("clearSelection")
      // hide with animation
    } else {
      // show with animation
      this.input.focus()
    }

    this.setState({
      isOpen: !isOpen,
    })
  }

  public render() {
    const { webview } = this.props

    const onInput = (e) => {
      webview.findInPage(e.currentTarget.value)
    }

    const inputEvents = {
      onInput,
    }

    return (
      <div>
        <Input
          ref={(r: Input) => (this.input = r)}
          placeholder="Find in page"
          focused={true}
          {...inputEvents}
        />
      </div>
    )
  }
}
