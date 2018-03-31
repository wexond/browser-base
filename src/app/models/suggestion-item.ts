export default interface SuggestionItem {
  primaryText: string;
  secondaryText?: string;
  id: number;
  favicon?: string;
  type: 'most-visited' | 'history' | 'bookmarks' | 'search';
}; // eslint-disable-line
