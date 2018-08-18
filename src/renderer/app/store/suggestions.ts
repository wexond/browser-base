import { observable } from 'mobx';
import { Suggestion } from 'interfaces';
import store from 'app-store';
import { icons } from 'defaults';
import { isURL } from 'utils';
import { getSearchSuggestions, getHistorySuggestions } from 'utils/suggestions';

let searchSuggestions: Suggestion[] = [];

export class SuggestionsStore {
  @observable
  public suggestions: Suggestion[] = [];

  @observable
  public selected = 0;

  public load(input: HTMLInputElement) {
    return new Promise(async (resolve, reject) => {
      const filter = input.value.substring(0, input.selectionStart);
      const history = getHistorySuggestions(filter);

      const historySuggestions: Suggestion[] = [];

      if ((!history[0] || !history[0].canSuggest) && filter.trim() !== '') {
        historySuggestions.unshift({
          primaryText: filter,
          secondaryText: store.dictionary.searchInGoogle,
          favicon: icons.search,
          isSearch: true,
        });
        if (isURL(filter)) {
          historySuggestions.unshift({
            primaryText: filter,
            secondaryText: store.dictionary.openWebsite,
            favicon: icons.page,
          });
        }
      }

      for (const item of history) {
        if (!item.isSearch) {
          historySuggestions.push({
            primaryText: item.url,
            secondaryText: item.title,
            favicon: store.faviconsStore.favicons[item.favicon],
            canSuggest: item.canSuggest,
          });
        } else {
          historySuggestions.push({
            primaryText: item.url,
            secondaryText: store.dictionary.searchInGoogle,
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

      this.suggestions = suggestions;

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

        this.suggestions = suggestions;
      }
    });
  }
}
