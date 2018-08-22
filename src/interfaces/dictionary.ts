export interface Dictionary {
  locale: string;
  languageCode: string;
  languageName: string;
  languageNativeName: string;
  countryCode: string;
  countryName: string;
  addressBar: {
    search: string;
  };
  suggestions: {
    mostVisited: string;
    bookmarks: string;
    history: string;
    googleSuggestions: string;
    searchInGoogle: string;
    openWebsite: string;
  };
  newTab: {
    precipitation: string;
    winds: string;
  };
  history: {
    title: string;
    clearHistory: string;
  };
  bookmarks: {
    title: string;
  };
  settings: {
    title: string;
  };
  extensions: {
    title: string;
  };
  about: {
    title: string;
    wexondVersion: string;
    reactVersion: string;
    electronVersion: string;
    nodejsVersion: string;
  };
  selecting: {
    selectAll: string;
    deselectAll: string;
    deleteSelected: string;
  };
  dateAndTime: {
    months: string[];
    days: string[];
    daysShort: string[];
    today: string;
    yesterday: string;
    ago: string;
    oneMinute: string;
    oneHour: string;
    minutes: string;
    hours: string;
  };
  general: {
    expand: string;
    collapse: string;
  };
  keyCommands: {
    'tabs.switch': string;
  };
}
