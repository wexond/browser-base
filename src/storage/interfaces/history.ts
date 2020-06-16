export interface IHistoryDbItem {
  id: number;
  url: string;
  title: string;
  visit_count: number;
  typed_count: number;
  last_visit_time: number;
  hidden: number;
}

export interface IHistoryDbVisitsItem {
  id: number;
  url: number;
  visit_time: number;
  from_visit: number;
  transition: number;
  segment_id: number;
  visit_duration: number;
  incremented_omnibox_typed_score: number;
}
