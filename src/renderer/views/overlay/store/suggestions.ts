import { observable, computed } from 'mobx';

import {
  getHistorySuggestions,
  getSearchSuggestions,
} from '../utils/suggestions';
import { isURL } from '~/utils/url';
import { ISuggestion } from '~/interfaces';
import store from '.';

let searchSuggestions: ISuggestion[] = [];

const MAX_SUGGESTIONS_COUNT = 8;

export class SuggestionsStore {
  @observable
  public list: ISuggestion[] = [];

  @observable
  public selectedId = 0;

  @observable
  public height = 0;

  @computed
  public get selected() {
    return this.list.find((x) => x.id === this.selectedId);
  }

  public load(input: HTMLInputElement): Promise<string> {
    return new Promise(async (resolve) => {
      const filter = input.value.substring(0, input.selectionStart);
      const history = getHistorySuggestions(filter);

      const historySuggestions: ISuggestion[] = [];

      for (const item of history) {
        if (!item.isSearch) {
          historySuggestions.push({
            primaryText: item.title,
            url: item.url,
            canSuggest: item.canSuggest,
          });
        } else {
          historySuggestions.push({
            primaryText: item.url,
            canSuggest: item.canSuggest,
            isSearch: true,
          });
        }
      }

      let idx = 1;

      if ((!history[0] || !history[0].canSuggest) && filter.trim() !== '') {
        if (isURL(filter) || filter.indexOf('://') !== -1) {
          historySuggestions.unshift({
            url: filter,
          });
        } else {
          idx = 0;
        }
      }

      historySuggestions.splice(idx, 0, {
        primaryText: filter,
        secondaryText: `${store.omnibox.searchEngine.name} Search`,
        isSearch: true,
      });

      let suggestions: ISuggestion[] =
        input.value === ''
          ? []
          : historySuggestions
              .concat(searchSuggestions)
              .slice(0, MAX_SUGGESTIONS_COUNT);

      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].id = i;
      }

      this.list = suggestions;

      if (historySuggestions.length > 0 && historySuggestions[0].canSuggest) {
        resolve(historySuggestions[0].url);
      }

      try {
        const searchData = await getSearchSuggestions(filter);

        if (input.value.substring(0, input.selectionStart) === filter) {
          searchSuggestions = [];
          for (const item of searchData) {
            searchSuggestions.push({
              primaryText: item,
              isSearch: true,
            });
          }

          suggestions =
            input.value === ''
              ? []
              : historySuggestions
                  .concat(searchSuggestions)
                  .slice(0, MAX_SUGGESTIONS_COUNT);

          for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].id = i;
          }

          this.list = suggestions;
        }
      } catch (e) {
        // console.error(e);
      }
    });
  }
}
