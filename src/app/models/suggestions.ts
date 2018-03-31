import { observable } from 'mobx';
import SuggestionItem from './suggestion-item';
import { favicons, Favicon } from '../utils/storage';
import { getHistorySuggestions } from '../utils/suggestions';
import Store from '../store';

export default class Suggestions {
  @observable public list: SuggestionItem[] = [];
  @observable public selected = 0;

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
    return new Promise(async (resolve) => {
      const suggestions = await getHistorySuggestions(filter);
      const newSuggestions: SuggestionItem[] = [];

      favicons.all('SELECT * FROM favicons', (err: any, faviconItems: Favicon[]) => {
        if (err) throw err;
        for (const favicon of faviconItems) {
          if (Store.favicons[favicon.url] == null) {
            Store.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
          }
        }

        let id = 0;

        for (const item of suggestions.mostVisited) {
          newSuggestions.push({
            primaryText: item.title,
            secondaryText: item.url,
            favicon: Store.favicons[item.favicon],
            type: 'most-visited',
            id: id++,
          });
        }

        for (const item of suggestions.history) {
          newSuggestions.push({
            primaryText: item.title,
            secondaryText: item.url,
            favicon: Store.favicons[item.favicon],
            type: 'history',
            id: id++,
          });
        }

        this.list = newSuggestions;

        resolve();
      });
    });
  }

  public suggest() {
    if (this.list.length > 0 && this.list[0].type === 'most-visited') {
      return this.list[0];
    }
    return null;
  }

  public getSelected() {
    return this.list.find(x => x.id === this.selected);
  }
}
