import * as React from 'react';

import { ipcRenderer } from 'electron';
import { observable, computed } from 'mobx';
import { DEFAULT_SEARCH_ENGINES } from '~/constants';
import { ISuggestion, IVisitedItem } from '~/interfaces';
import { SuggestionsStore } from './suggestions';
import { NEWTAB_URL } from '~/constants/tabs';
import { DialogStore } from '~/models/dialog-store';

let lastSuggestion: string;

interface ISearchTab {
  id?: number;
  title?: string;
  url?: string;
  favicon?: string;
}

export class Store extends DialogStore {
  public suggestions = new SuggestionsStore(this);

  @observable
  public visitedItems: IVisitedItem[] = [];

  @observable
  public tabs: ISearchTab[] = [];

  @observable
  public inputText = '';

  @computed
  public get searchEngines() {
    return DEFAULT_SEARCH_ENGINES.concat(this.settings.searchEngines);
  }

  @computed
  public get searchedTabs(): ISuggestion[] {
    const lastItem = this.suggestions.list[this.suggestions.list.length - 1];

    let id = 0;

    if (lastItem) {
      id = lastItem.id + 1;
    }

    return this.tabs
      .filter(
        tab =>
          tab.title.indexOf(this.inputText) !== -1 ||
          tab.url.indexOf(this.inputText) !== -1,
      )
      .map(tab => ({
        primaryText: tab.url,
        secondaryText: tab.title,
        id: id++,
        favicon: tab.favicon,
      }))
      .slice(0, 3);
  }

  @computed
  public get searchEngine() {
    return this.searchEngines[this.settings.searchEngine];
  }

  public canSuggest = false;

  public inputRef = React.createRef<HTMLInputElement>();

  public tabId = 1;

  public constructor() {
    super({
      hideOnBlur: false,
    });

    window.addEventListener('blur', async () => {
      if (this.visible && !(await ipcRenderer.invoke(`is-newtab-${this.id}`))) {
        this.visible = false;
        setTimeout(() => {
          this.hide();
        });
      }
    });

    ipcRenderer.on('visible', async (e, flag, tab) => {
      if (flag) {
        this.visible = flag;
        this.tabs = [];
        this.suggestions.list = [];
        this.tabId = tab.id;
        if (tab.url.startsWith(NEWTAB_URL)) {
          this.inputRef.current.value = '';
        } else {
          this.inputRef.current.value = tab.url;
        }

        this.inputRef.current.focus();
      } else if (!(await ipcRenderer.invoke(`is-newtab-${this.id}`))) {
        this.visible = flag;
      }
    });

    ipcRenderer.on('search-tabs', (e, tabs) => {
      this.tabs = tabs;
    });

    this.loadHistory();

    ipcRenderer.send(`can-show-${this.id}`);
  }

  public async loadHistory() {
    this.visitedItems = await ipcRenderer.invoke('topsites-get');
  }

  public suggest() {
    const { suggestions } = this;
    const input = this.inputRef.current;

    if (this.canSuggest) {
      this.autoComplete(input.value, lastSuggestion);
    }

    suggestions.load(input).then(suggestion => {
      lastSuggestion = suggestion;
      if (this.canSuggest) {
        this.autoComplete(
          input.value.substring(0, input.selectionStart),
          suggestion,
        );
        this.canSuggest = false;
      }
    });

    suggestions.selected = 0;
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
}

export default new Store();
