export interface ISuggestion {
  primaryText?: string;
  secondaryText?: string;
  id?: number;
  canSuggest?: boolean;
  isSearch?: boolean;
  hovered?: boolean;
  url?: string;
}
