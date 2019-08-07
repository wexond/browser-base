export const DEFAULT_SETTINGS = {
  darkTheme: false,
  shield: true,
  multrin: true,
  animations: true,
  overlayBookmarks: true,
  suggestions: true,
  searchEngines: [
    {
      name: 'Google (Recommended)',
      url: 'https://www.google.com/search?q=%s',
      keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    },
    {
      name: 'Bing',
      url: 'https://www.bing.com/search?q=%s',
      keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    },
    {
      name: 'Ecosia',
      url: 'https://www.ecosia.org/search?q=%s',
      keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    },
    {
      name: 'DuckDuckGo',
      url: 'https://duckduckgo.com/?q=%s',
      keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    },
    {
      name: 'Yahoo!',
      url: 'https://search.yahoo.com/search?p=%s',
      keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
    },
  ],
  searchEngine: 0,
  startupBehavior: {
    type: 'continue',
  },
};
