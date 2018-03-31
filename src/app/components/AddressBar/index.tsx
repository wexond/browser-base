import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Input, InputContainer, StyledAddressBar } from './styles';
import Store from '../../store';
import { isURL } from '../../utils/url';
import Suggestions from '../Suggestions';

interface Props {
  visible: boolean;
}

@observer
export default class AddressBar extends Component<Props, {}> {
  private input: HTMLInputElement;

  public componentDidMount() {
    window.addEventListener('mousedown', () => {
      Store.addressBar.toggled = false;
      Store.suggestions.clear();
    });
  }

  public onInputFocus = () => {
    this.input.select();
  };

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      if (e.keyCode === 40) {
        Store.suggestions.selectNext();
      } else if (e.keyCode === 38) {
        Store.suggestions.selectPrevious();
      }

      const suggestion = Store.suggestions.getSelected();

      if (
        suggestion.type === 'history' ||
        suggestion.type === 'bookmarks' ||
        suggestion.type === 'most-visited'
      ) {
        this.input.value = suggestion.secondaryText;
      } else {
        this.input.value = suggestion.primaryText;
      }
    }
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

  public onInput = async () => {
    Store.suggestions.suggest(this.input.value);
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
            onMouseDown={e => e.stopPropagation()}
            placeholder="Search"
            onInput={this.onInput}
            visible={Store.addressBar.toggled}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyDown}
          />
          <Suggestions />
        </InputContainer>
      </StyledAddressBar>
    );
  }
}
