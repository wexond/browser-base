import { ISettings } from '~/interfaces';
import { remote, app } from 'electron';

const pkg = require('../../package.json');

export const DEFAULT_SETTINGS: ISettings = {
  theme: 'wexond-light',
  darkContents: false,
  shield: true,
  multrin: true,
  animations: true,
  bookmarksBar: false,
  suggestions: true,
  themeAuto: true,
  searchEngines: [],
  searchEngine: 0,
  startupBehavior: {
    type: 'empty',
  },
  warnOnQuit: true,
  version: pkg.version,
  downloadsDialog: false,
  downloadsPath: remote
    ? remote.app.getPath('downloads')
    : app
    ? app.getPath('downloads')
    : '',
};

export const DEFAULT_SEARCH_ENGINES = [
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
    keywordsUrl: '',
  },
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    keywordsUrl: 'http://google.com/complete/search?client=chrome&q=%s',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    keywordsUrl: '',
  },
  {
    name: 'Ekoru',
    url: 'https://www.ekoru.org/?ext=wexond&q=%s',
    keywordsUrl: 'http://ac.ekoru.org/?ext=wexond&q=%s',
  },
  {
    name: 'Ecosia',
    url: 'https://www.ecosia.org/search?q=%s',
    keywordsUrl: '',
  },
  {
    name: 'Yahoo!',
    url: 'https://search.yahoo.com/search?p=%s',
    keywordsUrl: '',
  },
];
