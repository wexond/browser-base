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
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  bookmarksBar: boolean;
  suggestions: boolean;
  searchEngine: number;
  searchEngines: ISearchEngine[];
  startupBehavior: IStartupBehavior;
  version: string;
  darkContents: boolean;
}
