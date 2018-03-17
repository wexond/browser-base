import React, { Component } from "react";

import Store from "../../store"

import {
  StyledAddressBar,
  Input
} from "./styles"
interface IProps {
  visible: boolean
}

export default class AddressBar extends Component<IProps, {}> {

  private input: HTMLInputElement;

  private isURL = (input: string): boolean => {
    const _isURL = (input: string) => {
      let pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
      return pattern.test(input)
    }

    if (_isURL(input)) {
      return true
    } else {
      return _isURL('http://' + input)
    }
  }

  private getDomain = (url: string): string => {
    let hostname = url

    if (hostname.includes("http://") || hostname.includes('https://')) {
      hostname = hostname.split('://')[1]
    }

    if (hostname.includes('?')) {
      hostname = hostname.split('?')[0]
    }

    if (hostname.includes('://')) {
      hostname = hostname.split('://')[0] + '://' + hostname.split('/')[2]
    } else {
      hostname = hostname.split('/')[0]
    }

    return hostname
  }
  public onInputBlur = () => {
    Store.addressBar.toggled = false;
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) { // Enter.
      e.preventDefault()

      const text = e.currentTarget.value
      let url = text

      if (this.isURL(text) && !text.includes("://")) {
        url = "http://" + text
      } else if (!text.includes("://")) {
        url = "https://www.google.com/search?q=" + text
      }

      this.input.value = url
      Store.currentTab.page.url = url
      Store.currentTab.title = this.getDomain(url)
    }  
  }
  public render() {
    const { visible } = this.props
    
    if (Store.addressBar.toggled) {
      this.input.focus();
    }

    return (
      <StyledAddressBar visible={visible}>
        <Input
          innerRef={r => (this.input = r)}
          onBlur={this.onInputBlur}
          placeholder="Search"
          visible={Store.addressBar.toggled}
          onKeyPress={this.onKeyPress}
        />
      </StyledAddressBar>
    )
  }
}
