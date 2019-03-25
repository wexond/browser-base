import { observable, computed } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import store from '.';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';
import { readFile } from 'fs';
import { getPath } from '~/shared/utils/paths';

let lastSuggestion: string;

const autoComplete = (text: string, suggestion: string) => {
  const regex = /(http(s?)):\/\/(www.)?|www./gi;
  const regex2 = /(http(s?)):\/\//gi;

  const start = text.length;

  const input = store.overlayStore.inputRef.current;

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
  public bsRef: HTMLDivElement;
  public inputRef = React.createRef<HTMLInputElement>();

  public canSuggest = false;

  public lastUrl: string;

  @observable
  private _visible = false;

  @observable
  public bottom = 128;

  private timeout: any;

  @computed
  public get visible() {
    return this._visible;
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
        ipcRenderer.send('browserview-show');
        store.screenshot = '';
      }, 150);
      store.suggestionsStore.suggestions = [];
      lastSuggestion = undefined;
      this.inputRef.current.value = '';
      this._visible = val;
    } else {
      const rect = this.inputRef.current.getBoundingClientRect();
      this.bottom = Math.min(
        window.innerHeight - (rect.top + rect.height + 300),
        this.bsRef.offsetHeight,
      );

      callBrowserViewMethod('getScreenshot').then(data => {
        store.screenshot = data;

        setTimeout(() => {
          this.show();
          ipcRenderer.send('window-focus');

          callBrowserViewMethod('webContents.getURL').then(
            async (url: string) => {
              this.inputRef.current.value = url;
              this.inputRef.current.focus();
              this.inputRef.current.select();

              this.lastUrl = url;
            },
          );

          this._visible = val;
        }, 20);
      });
    }
  }

  public suggest() {
    const { suggestionsStore } = store;
    const input = this.inputRef.current;

    if (this.canSuggest) {
      autoComplete(input.value, lastSuggestion);
    }

    suggestionsStore.load(input).then(suggestion => {
      lastSuggestion = suggestion;
      if (this.canSuggest) {
        autoComplete(
          input.value.substring(0, input.selectionStart),
          suggestion,
        );
        this.canSuggest = false;
      }
    });

    suggestionsStore.selected = 0;
  }
}
