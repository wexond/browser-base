import { observable } from 'mobx';
import SuggestionItem from './suggestion-item';
import { favicons, Favicon } from '../utils/storage';
import { getHistorySuggestions, getSearchSuggestions } from '../utils/suggestions';
import Store from '../store';
import { isURL } from '../utils/url';

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

  public load(filter: string) {
    return new Promise(async resolve => {
      this.historySuggestions = [];
      const suggestions = await getHistorySuggestions(filter);

      favicons.all('SELECT * FROM favicons', (err: any, faviconItems: Favicon[]) => {
        if (err) throw err;
        for (const favicon of faviconItems) {
          if (Store.favicons[favicon.url] == null) {
            Store.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
          }
        }

        let id = 0;

        if (suggestions.mostVisited.length === 0) {
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
        });

        this.list = this.searchSuggestions.concat(this.historySuggestions);

        resolve();
      });
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
}
