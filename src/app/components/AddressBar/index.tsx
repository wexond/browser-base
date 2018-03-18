import React, { Component } from 'react';

// Styles
import { Input, StyledAddressBar } from './styles';

// Utils
import { isURL } from '../../utils/url';

import Store from '../../store';

interface IProps {
  visible: boolean;
}

export default class AddressBar extends Component<IProps, {}> {
  private input: HTMLInputElement;

  public onInputBlur = () => {
    Store.addressBar.toggle(false);
  };

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

      Store.addressBar.toggle(false);
    }
  };

  public render() {
    const { visible } = this.props;

    if (Store.addressBar.toggled) {
      this.input.focus();
    }

    return (
      <StyledAddressBar visible={visible}>
        <Input
          innerRef={r => (this.input = r)}
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
          placeholder="Search"
          visible={Store.addressBar.toggled}
          onKeyPress={this.onKeyPress}
        />
      </StyledAddressBar>
    );
  }
}
