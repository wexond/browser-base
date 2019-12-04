export interface ISearchEngine {
  name: string;
  url: string;
  keywordsUrl: string;
}

export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
}

export interface ISettings {
  theme: string;
  themeAuto: boolean;
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  bookmarksBar: boolean;
  suggestions: boolean;
  searchEngine: number;
  searchEngines: ISearchEngine[];
  startupBehavior: IStartupBehavior;
  warnOnQuit: boolean;
  version: string;
  darkContents: boolean;
}
