import * as React from 'react';

import { observable, computed } from 'mobx';
import { ISuggestion, IVisitedItem } from '~/interfaces';
import store from '.';

let lastSuggestion: string;

interface ISearchTab {
  id?: number;
  title?: string;
  url?: string;
  favicon?: string;
}

export class OmniboxStore {
  @observable
  public x = 0;

  @observable
  public y = 0;

  @observable
  public width = 0;

  @observable
  public visible = false;

  @observable
  public visitedItems: IVisitedItem[] = [];

  @observable
  public tabs: ISearchTab[] = [];

  @observable
  public inputText = '';

  @computed
  public get searchedTabs(): ISuggestion[] {
    const lastItem = store.suggestions.list[store.suggestions.list.length - 1];

    let id = 0;

    if (lastItem) {
      id = lastItem.id + 1;
    }

    return this.tabs
      .filter(
        (tab) =>
          tab.title.indexOf(this.inputText) !== -1 ||
          tab.url.indexOf(this.inputText) !== -1,
      )
      .map((tab) => ({
        primaryText: tab.url,
        secondaryText: tab.title,
        id: id++,
        favicon: tab.favicon,
      }))
      .slice(0, 3);
  }

  @computed
  public get searchEngine() {
    return store.settings.searchEngines[store.settings.searchEngine];
  }

  public canSuggest = false;

  public inputRef = React.createRef<HTMLInputElement>();

  public constructor() {
    browser.ipcRenderer.on('omnibox-input', (e, data) => {
      this.x = data.x;
      this.y = data.y;
      this.width = data.width;

      this.visible = true;

      this.tabs = [];
      store.tabId = data.id;

      this.canSuggest = this.inputText.length <= data.text.length;

      this.inputRef.current.value = data.text;
      this.inputRef.current.focus();

      this.inputRef.current.setSelectionRange(data.cursorPos, data.cursorPos);

      const event = new Event('input', { bubbles: true });
      this.inputRef.current.dispatchEvent(event);
    });

    browser.ipcRenderer.on('search-tabs', (e, tabs) => {
      this.tabs = tabs;
    });

    // this.loadHistory();
  }

  public getCanSuggest(key: number) {
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
      return true;
    }

    return false;
  }

  public async loadHistory() {
    this.visitedItems = await browser.ipcRenderer.invoke('topsites-get');
  }

  public suggest() {
    const { suggestions } = store;
    const input = this.inputRef.current;

    if (this.canSuggest) {
      this.autoComplete(input.value, lastSuggestion);
    }

    suggestions.load(input).then((suggestion) => {
      lastSuggestion = suggestion;
      if (this.canSuggest) {
        this.autoComplete(
          input.value.substring(0, input.selectionStart),
          suggestion,
        );
        this.canSuggest = false;
      }
    });

    suggestions.selectedId = 0;
  }

  public autoComplete(text: string, suggestion: string) {
    const regex = /(http(s?)):\/\/(www.)?|www./gi;
    const regex2 = /(http(s?)):\/\//gi;

    const start = text.length;

    const input = this.inputRef.current;

    if (input.selectionStart !== input.value.length) return;

    if (suggestion) {
      if (suggestion.startsWith(text.replace(regex, ''))) {
        input.value = text + suggestion.replace(text.replace(regex, ''), '');
      } else if (`www.${suggestion}`.startsWith(text.replace(regex2, ''))) {
        input.value =
          text + `www.${suggestion}`.replace(text.replace(regex2, ''), '');
      }
      input.setSelectionRange(start, input.value.length);
    }
  }

  public hide(data: { focus?: boolean; escape?: boolean } = {}) {
    if (!this.visible) return;

    browser.ipcRenderer.send(`omnibox-update-input`, {
      id: store.tabId,
      text: this.inputRef.current.value,
      selectionStart: this.inputRef.current.selectionStart,
      selectionEnd: this.inputRef.current.selectionEnd,
      ...data,
    });

    this.visible = false;
    this.tabs = [];
    this.inputRef.current.value = '';
    store.suggestions.list = [];
  }
}
