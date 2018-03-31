import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Input, InputContainer, StyledAddressBar } from './styles';
import SuggestionItem from '../../models/suggestion-item';
import Store from '../../store';
import { favicons } from '../../utils/storage';
import { getHistorySuggestions } from '../../utils/suggestions';
import { isURL } from '../../utils/url';
import Suggestions from '../Suggestions';

interface Favicon {
  url: string;
  favicon: Buffer;
}

interface Props {
  visible: boolean;
}

@observer
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

  public onInput = async () => {
    const suggestions = await getHistorySuggestions(this.input.value);
    const mostVisited: SuggestionItem[] = [];
    const historySuggestions: SuggestionItem[] = [];

    favicons.all('SELECT * FROM favicons', (err: any, faviconItems: Favicon[]) => {
      if (err) throw err;
      for (const favicon of faviconItems) {
        if (Store.favicons[favicon.url] == null) {
          Store.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      }

      let id = 0;

      for (const item of suggestions.mostVisited) {
        mostVisited.push({
          primaryText: item.title,
          secondaryText: item.url,
          favicon: Store.favicons[item.favicon],
          id: id++,
        });
      }

      for (const item of suggestions.history) {
        historySuggestions.push({
          primaryText: item.title,
          secondaryText: item.url,
          favicon: Store.favicons[item.favicon],
          id: id++,
        });
      }

      Store.suggestions = {
        ...Store.suggestions,
        history: historySuggestions,
        mostVisited,
      };
    });
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
          />
          <Suggestions />
        </InputContainer>
      </StyledAddressBar>
    );
  }
}
