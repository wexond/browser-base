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
  transition?: ITransitionType;
}

export enum ITransitionType {
  'link',
  'typed',
  'auto_bookmark',
  'auto_subframe',
  'manual_subframe',
  'generated',
  'auto_toplevel',
  'form_submit',
  'reload',
  'keyword',
  'keyword_generated',
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
