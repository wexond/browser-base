export interface ISearchEngine {
  name?: string;
  url?: string;
  keywordsUrl?: string;
  keyword?: string;
  icon?: string;
}

export interface IStartupBehavior {
  type: 'continue' | 'urls' | 'empty';
}

export type TopBarVariant = 'default' | 'compact';

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
  version: number;
  darkContents: boolean;
  downloadsDialog: boolean;
  downloadsPath: string;
  doNotTrack: boolean;
  topBarVariant: TopBarVariant;
}
