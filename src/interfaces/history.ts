export interface IHistoryItem {
  id?: string;
  url?: string;
  title: string;
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
}

export interface IVisitItem {
  id?: string;
  visitId?: string;
  visitTime?: number;
  referringVisitId?: string;
  transition?: string;
}

export interface IHistorySearchDetails {
  text: string;
  startTime?: number;
  endTime?: number;
  maxResults?: number;
}

export interface IVisitsDetails {
  url: string;
}

export interface IHistoryAddDetails {
  url: string;
}

export interface IHistoryDeleteDetails {
  url: string;
}

export interface IHistoryDeleteRange {
  startTime: number;
  endTime: number;
}

export interface IHistoryVisitsRemoved {
  allHistory: boolean;
  urls?: string[];
}
