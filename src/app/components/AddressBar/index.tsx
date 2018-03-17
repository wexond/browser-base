import React, { Component } from "react";

// Styles
import {
  Input,
  StyledAddressBar
} from "./styles"

// Actions
import * as pages from "../../actions/pages";

import Store from "../../store"

interface IProps {
  visible: boolean
}

export default class AddressBar extends Component<IProps, {}> {
  private input: HTMLInputElement;

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
      
      const page = pages.getPageById(Store.currentTab.id);

      page.url = url
    }  
  }

  public isURL = (input: string): boolean => {
    const isURLRegex = (url: string) => {
      const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
      return pattern.test(url)
    }

    if (isURLRegex(input)) {
      return true
    } else {
      return isURLRegex('http://' + input)
    }
  }

  public getDomain = (url: string): string => {
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
