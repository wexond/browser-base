import { observer } from 'mobx-react';
import React, { Component } from 'react';

import store from '@app/store';
import { isURL } from '@/utils/url';
import { observe } from 'mobx';
import { StyledAddressBar, InputContainer, Icon, Input } from './styles';
import Suggestions from '../Suggestions';
import { icons } from '@/constants/renderer';
import Dial from '@app/components/Dial';

@observer
export default class AddressBar extends Component {
  private input: HTMLInputElement;
  private canSuggest = false;
  private lastSuggestion: string;

  public componentDidMount() {
    window.addEventListener('mousedown', () => {
      store.addressBarStore.toggled = false;
      store.suggestionsStore.suggestions = [];
    });

    observe(store.addressBarStore, change => {
      if (change.object.toggled && change.name === 'toggled') {
        const page = store.pagesStore.getSelected();

        if (this.input) {
          if (page.webview && page.webview.getWebContents()) {
            let text = page.webview.getURL();

            if (text.startsWith('wexond://newtab')) {
              text = '';
            } else if (!text.startsWith('wexond://error')) {
              this.input.value = text;
            }
          }

          this.input.focus();
        }
      }
    });
  }

  public onInputFocus = () => {
    setTimeout(() => {
      this.input.select();
    }, 1);
  };

  public autoComplete(text: string, suggestion: string) {
    const regex = /(http(s?)):\/\/(www.)?|www./gi;
    const regex2 = /(http(s?)):\/\//gi;

    const start = text.length;

    if (suggestion) {
      if (suggestion.startsWith(text.replace(regex, ''))) {
        this.input.value =
          text + suggestion.replace(text.replace(regex, ''), '');
      } else if (`www.${suggestion}`.startsWith(text.replace(regex2, ''))) {
        this.input.value =
          text + `www.${suggestion}`.replace(text.replace(regex2, ''), '');
      }
      this.input.setSelectionRange(start, this.input.value.length);
    }
  }

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.keyCode;
    const { suggestionsStore } = store;
    const { suggestions } = suggestionsStore;

    if (
      key !== 8 && // backspace
      key !== 13 && // enter
      key !== 17 && // ctrl
      key !== 18 && // alt
      key !== 16 && // shift
      key !== 9 && // tab
      key !== 20 && // capslock
      key !== 46 && // delete
      key !== 32 // space
    ) {
      this.canSuggest = true;
    } else {
      this.canSuggest = false;
    }

    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      if (
        e.keyCode === 40 &&
        suggestionsStore.selected + 1 <= suggestions.length - 1
      ) {
        suggestionsStore.selected++;
      } else if (e.keyCode === 38 && suggestionsStore.selected - 1 >= 0) {
        suggestionsStore.selected--;
      }

      const suggestion = suggestions.find(
        x => x.id === suggestionsStore.selected,
      );

      this.input.value = suggestion.primaryText;
    }
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      // Enter.
      const tab = store.tabsStore.getSelectedTab();

      e.preventDefault();

      const text = e.currentTarget.value;
      let url = text;

      if (isURL(text) && !text.includes('://')) {
        url = `http://${text}`;
      } else if (!text.includes('://')) {
        url = `https://www.google.com/search?q=${text}`;
      }

      this.input.value = url;

      const page = store.pagesStore.getById(tab.id);

      page.url = url;

      store.addressBarStore.toggled = false;
    }
  };

  public onInput = () => {
    const { suggestionsStore } = store;

    if (this.canSuggest) {
      this.autoComplete(this.input.value, this.lastSuggestion);
    }

    suggestionsStore.load(this.input).then(suggestion => {
      this.lastSuggestion = suggestion;
      if (this.canSuggest) {
        this.autoComplete(
          this.input.value.substring(0, this.input.selectionStart),
          suggestion,
        );
        this.canSuggest = false;
      }
    });

    suggestionsStore.selected = 0;
  };

  public getInputValue = () => {
    if (this.input != null) {
      return this.input.value;
    }
    return null;
  };

  public render() {
    const dictionary = store.dictionary.addressBar;
    const suggestionsVisible = store.suggestionsStore.suggestions.length !== 0;

    return (
      <StyledAddressBar
        visible={store.addressBarStore.toggled}
        onMouseDown={e => e.stopPropagation()}
      >
        <InputContainer>
          <Icon image={icons.search} />
          <Input
            innerRef={r => (this.input = r)}
            onFocus={this.onInputFocus}
            placeholder={dictionary.search}
            onInput={this.onInput}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyDown}
          />
        </InputContainer>
        <Suggestions visible={suggestionsVisible} />
        <Dial />
      </StyledAddressBar>
    );
  }
}
