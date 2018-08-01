export default interface SuggestionItem {
  primaryText: string;
  secondaryText?: string;
  id?: number;
  favicon?: string;
  canSuggest?: boolean;
  isSearch?: boolean;
} // eslint-disable-line
