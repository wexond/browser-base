export interface Suggestion {
  primaryText: string;
  secondaryText?: string;
  id?: number;
  favicon?: string;
  canSuggest?: boolean;
  isSearch?: boolean;
  hovered?: boolean;
}
