import { observable } from 'mobx';

import {
  getHistorySuggestions,
  getSearchSuggestions,
} from '../utils/suggestions';
import { icons } from '~/renderer/constants/icons';
import { isURL } from '~/utils';
import { ISuggestion } from '~/interfaces';
import { Store } from '.';

let searchSuggestions: ISuggestion[] = [];

export class SuggestionsStore {
  private store: Store;

  @observable
  public list: ISuggestion[] = [];

  @observable
  public selected = 0;

  @observable
  public height = 0;

  constructor(store: Store) {
    this.store = store;
  }

  public load(input: HTMLInputElement): Promise<string> {
    return new Promise(async resolve => {
      const filter = input.value.substring(0, input.selectionStart);
      const history = getHistorySuggestions(filter);

      const historySuggestions: ISuggestion[] = [];

      if ((!history[0] || !history[0].canSuggest) && filter.trim() !== '') {
        historySuggestions.unshift({
          primaryText: filter,
          secondaryText: 'search in Google',
          favicon: icons.search,
          isSearch: true,
        });
        if (isURL(filter)) {
          historySuggestions.unshift({
            primaryText: filter,
            secondaryText: 'open website',
            favicon: icons.page,
          });
        }
      }

      for (const item of history) {
        if (!item.isSearch) {
          historySuggestions.push({
            primaryText: item.url,
            secondaryText: item.title,
            favicon: this.store.favicons.get(item.favicon),
            canSuggest: item.canSuggest,
          });
        } else {
          historySuggestions.push({
            primaryText: item.url,
            secondaryText: 'search in Google',
            favicon: icons.search,
            canSuggest: item.canSuggest,
          });
        }
      }

      let suggestions: ISuggestion[] =
        input.value === ''
          ? []
          : historySuggestions.concat(searchSuggestions).slice(0, 6);

      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].id = i;
      }

      this.list = suggestions;

      if (historySuggestions.length > 0 && historySuggestions[0].canSuggest) {
        resolve(historySuggestions[0].primaryText);
      }

      try {
        const searchData = await getSearchSuggestions(filter);

        if (input.value.substring(0, input.selectionStart) === filter) {
          searchSuggestions = [];
          for (const item of searchData) {
            searchSuggestions.push({
              primaryText: item,
              favicon: icons.search,
              isSearch: true,
            });
          }

          suggestions =
            input.value === ''
              ? []
              : historySuggestions.concat(searchSuggestions).slice(0, 6);

          for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].id = i;
          }

          this.list = suggestions;
        }
      } catch (e) {}
    });
  }
}
