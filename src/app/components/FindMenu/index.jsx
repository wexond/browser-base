import React from 'react'

import { observer } from 'mobx-react'
import Store from '../../store'

import Storage from '../../utils/storage'
import Colors from '../../utils/colors'

import * as filesActions from '../../actions/files'
import * as tabsActions from '../../actions/tabs'
import * as webviewActions from '../../actions/webview'

import Input from '../../../Material/Input'

@observer
export default class FindMenu extends React.Component {

  constructor() {
    super()

    this.state = {
      isOpen: false
    }
  }

  

  last() {
    this.props.webview.findInPage(input.value, {
      forward: false,
      findNext: true
    })
  }

  next() {
    this.props.webview.findInPage(input.value, {
      forward: true,
      findNext: true
    })
  }

  toggle() {
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
      isOpen: !isOpen
    })
  }

  render() {
    const {
      webview
    } = this.props

    const onInput = (e) => {
      webview.findInPage(e.currentTarget.value)
    }

    const inputEvents = {
      onInput: onInput
    }

    return (
      <div>
        <Input ref={ (r) => this.input = r } placeholder='Find in page' focused={true} {...inputEvents} />
      </div>
    )
  }
}
