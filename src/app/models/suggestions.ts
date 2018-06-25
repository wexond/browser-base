import { observable } from 'mobx';
import SuggestionItem from './suggestion-item';
import { getHistorySuggestions, getSearchSuggestions } from '../utils/suggestions';
import Store from '../store';
import { Favicon } from '../../shared/models/favicon';
import db from '../../shared/models/app-database';
import { isURL } from '../../shared/utils/url';

export default class Suggestions {
  @observable public list: SuggestionItem[] = [];

  @observable public selected = 0;

  private searchSuggestions: SuggestionItem[] = [];

  private historySuggestions: SuggestionItem[] = [];

  public selectNext() {
    if (this.selected + 1 <= this.list.length - 1) this.selected++;
  }

  public selectPrevious() {
    if (this.selected - 1 >= 0) this.selected--;
  }

  public clear() {
    this.list = [];
  }

  public load(input: HTMLInputElement) {
    return new Promise(async resolve => {
      const filter = input.value;

      const suggestions = await getHistorySuggestions(filter);

      await db.favicons.each(favicon => {
        if (Store.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          Store.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      });

      this.historySuggestions = [];

      let id = 0;

      if (suggestions.mostVisited.length === 0 && filter.trim() !== '') {
        this.historySuggestions = this.historySuggestions.filter(
          x => x.type !== 'no-subheader-search' && x.type !== 'no-subheader-website',
        );

        this.historySuggestions.unshift({
          primaryText: filter,
          secondaryText: 'search in Google',
          type: 'no-subheader-search',
          id: 0,
        });
        id = 1;
        if (isURL(filter)) {
          this.historySuggestions[0].id = 1;
          this.historySuggestions.unshift({
            primaryText: filter,
            secondaryText: 'open website',
            type: 'no-subheader-website',
            id: 0,
          });
          id = 2;
        }
      }

      for (const item of suggestions.mostVisited) {
        this.historySuggestions.push({
          primaryText: item.title,
          secondaryText: item.url,
          favicon: Store.favicons[item.favicon],
          type: 'most-visited',
          id: id++,
        });
      }

      for (const item of suggestions.history) {
        this.historySuggestions.push({
          primaryText: item.title,
          secondaryText: item.url,
          favicon: Store.favicons[item.favicon],
          type: 'history',
          id: id++,
        });
      }

      getSearchSuggestions(filter).then(data => {
        this.searchSuggestions = [];
        for (const item of data) {
          this.searchSuggestions.push({
            primaryText: item.title,
            type: 'search',
            id: id++,
          });
        }

        this.list = this.historySuggestions.concat(this.searchSuggestions);

        if (input.value === '') this.list = [];
      });

      this.list = this.searchSuggestions.concat(this.historySuggestions);

      if (input.value === '') this.list = [];

      resolve();
    });
  }

  public suggest() {
    if (this.historySuggestions.length > 0 && this.historySuggestions[0].type === 'most-visited') {
      return this.historySuggestions[0];
    }
    return null;
  }

  public getSelected() {
    return this.list.find(x => x.id === this.selected);
  }

  public getVisible() {
    const { list } = this;

    if (list.length === 0) {
      return false;
    }

    return true;
  }
}
