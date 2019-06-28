import { observable } from 'mobx';
import { getHistorySuggestions, getSearchSuggestions } from '../utils';
import store from '.';
import { icons } from '../constants';
import { isURL } from '~/shared/utils/url';
import { Suggestion } from '../models';

let searchSuggestions: Suggestion[] = [];

export class SuggestionsStore {
  @observable
  public list: Suggestion[] = [];

  @observable
  public selected = 0;

  @observable
  public height = 0;

  public load(input: HTMLInputElement) {
    return new Promise(async (resolve: (result: string) => void, reject) => {
      const filter = input.value.substring(0, input.selectionStart);
      const history = getHistorySuggestions(filter);

      const historySuggestions: Suggestion[] = [];

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
            favicon: store.favicons.favicons[item.favicon],
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

      let suggestions: Suggestion[] =
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
    });
  }
}
