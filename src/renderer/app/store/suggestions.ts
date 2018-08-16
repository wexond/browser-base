import { observable } from 'mobx';

export class SuggestionsStore {
  @observable
  public suggestions: SuggestionItem[] = [];

  @observable
  public selectedSuggestion = 0;
}
