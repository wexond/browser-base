export interface ISearchEngine {
  name: string;
  url: string;
  keywordsUrl: string;
}

export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
  urls?: string[];
}

export interface ISettings {
  darkTheme: boolean;
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  overlayBookmarks: boolean;
  suggestions: boolean;
  searchEngine: number;
  searchEngines: ISearchEngine[];
  startupBehavior: IStartupBehavior;
}
