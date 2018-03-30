import React, { Component } from 'react';

// Styles
import { Input, StyledAddressBar, InputContainer } from './styles';

// Utils
import { isURL } from '../../utils/url';

import Suggestions from '../Suggestions';

import Store from '../../store';

interface Props {
  visible: boolean;
}

export default class AddressBar extends Component<Props, {}> {
  private input: HTMLInputElement;

  public componentDidMount() {
    window.addEventListener('mousedown', () => {
      Store.addressBar.toggled = false;
    });
  }

  public onInputFocus = () => {
    this.input.select();
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      // Enter.
      const tabGroup = Store.getCurrentTabGroup();
      const tab = tabGroup.getSelectedTab();

      e.preventDefault();

      const text = e.currentTarget.value;
      let url = text;

      if (isURL(text) && !text.includes('://')) {
        url = `http://${text}`;
      } else if (!text.includes('://')) {
        url = `https://www.google.com/search?q=${text}`;
      }

      this.input.value = url;

      const page = Store.getPageById(tab.id);

      page.url = url;

      Store.addressBar.toggled = false;
    }
  };

  public render() {
    const { visible } = this.props;

    if (Store.addressBar.toggled) {
      const page = Store.getSelectedPage();
      if (page.webview != null && page.webview.getWebContents() != null) {
        this.input.value = page.webview.getURL();
      }

      this.input.focus();
    }

    return (
      <StyledAddressBar visible={visible}>
        <InputContainer>
          <Input
            innerRef={r => (this.input = r)}
            onFocus={this.onInputFocus}
            placeholder="Search"
            visible={Store.addressBar.toggled}
            onKeyPress={this.onKeyPress}
          />
          <Suggestions />
        </InputContainer>
      </StyledAddressBar>
    );
  }
}
