import { ISearchEngine } from './search-engine';

export interface ISettings {
  darkTheme: boolean;
  shield: boolean;
  multrin: boolean;
  animations: boolean;
  overlayBookmarks: boolean;
  suggestions: boolean;
  searchEngine: number;
  searchEngines: ISearchEngine[];
}
