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
  ],
  searchEngine: 0,
};
