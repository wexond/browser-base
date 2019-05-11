import { observable, computed } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import store from '.';

let lastSuggestion: string;

const autoComplete = (text: string, suggestion: string) => {
  const regex = /(http(s?)):\/\/(www.)?|www./gi;
  const regex2 = /(http(s?)):\/\//gi;

  const start = text.length;

  const input = store.overlay.inputRef.current;

  if (suggestion) {
    if (suggestion.startsWith(text.replace(regex, ''))) {
      input.value = text + suggestion.replace(text.replace(regex, ''), '');
    } else if (`www.${suggestion}`.startsWith(text.replace(regex2, ''))) {
      input.value =
        text + `www.${suggestion}`.replace(text.replace(regex2, ''), '');
    }
    input.setSelectionRange(start, input.value.length);
  }
};

export class OverlayStore {
  public scrollRef = React.createRef<HTMLDivElement>();
  public inputRef = React.createRef<HTMLInputElement>();

  public canSuggest = false;

  @observable
  private _visible = true;

  @observable
  public isNewTab = true;

  @observable
  public currentContent: 'default' | 'history' | 'bookmarks' = 'default';

  @observable
  public dialTypeMenuVisible = false;

  @observable
  public _searchBoxValue = '';

  private timeout: any;

  @computed
  public get searchBoxValue() {
    return this._searchBoxValue;
  }

  public set searchBoxValue(val: string) {
    this._searchBoxValue = val;
    this.inputRef.current.value = val;
  }

  constructor() {
    window.addEventListener('keydown', this.onWindowKeyDown);
  }

  public onWindowKeyDown = (e: KeyboardEvent) => {
    if (!this._visible || e.keyCode !== 27) return; // Escape

    if (this.currentContent !== 'default') {
      this.currentContent = 'default';
    } else if (!this.isNewTab) {
      this.visible = false;
    }
  };

  @computed
  public get visible() {
    return this._visible;
  }

  @computed
  public get isBookmarked() {
    if (!store.tabs.selectedTab) return false;

    return !!store.bookmarks.list.find(
      x => x.url === store.tabs.selectedTab.url,
    );
  }

  public async show() {
    clearTimeout(this.timeout);

    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTop = 0;
    }

    ipcRenderer.send('browserview-hide');

    this._visible = true;
  }

  public set visible(val: boolean) {
    if (val === this._visible) return;

    if (!val) {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        if (store.tabs.selectedTab) {
          if (store.tabs.selectedTab.isWindow) store.tabs.selectedTab.select();
          else ipcRenderer.send('browserview-show');
        }
      }, 200);

      store.suggestions.list = [];
      lastSuggestion = undefined;

      this.inputRef.current.value = '';

      this._visible = val;
      this.isNewTab = false;
      this.currentContent = 'default';
    } else {
      this.show();
      ipcRenderer.send('window-focus');

      if (!this.isNewTab) {
        store.tabs.selectedTab
          .callViewMethod('webContents.getURL')
          .then(async (url: string) => {
            this.searchBoxValue = url;
            this.inputRef.current.focus();
            this.inputRef.current.select();
          });
      } else {
        this.inputRef.current.value = '';

        setTimeout(() => {
          this.inputRef.current.focus();
          this.inputRef.current.select();
        });
      }

      this._visible = val;
    }
  }

  public suggest() {
    const { suggestions } = store;
    const input = this.inputRef.current;

    if (this.canSuggest) {
      autoComplete(input.value, lastSuggestion);
    }

    suggestions.load(input).then(suggestion => {
      lastSuggestion = suggestion;
      if (this.canSuggest) {
        autoComplete(
          input.value.substring(0, input.selectionStart),
          suggestion,
        );
        this.canSuggest = false;
      }
    });

    suggestions.selected = 0;
  }
}
