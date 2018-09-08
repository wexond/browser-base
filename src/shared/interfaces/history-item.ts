import { HistorySection } from '@/interfaces/history/history-section';

export interface HistoryItem {
  _id?: string;
  title?: string;
  url?: string;
  date?: string;
  favicon?: string;
  hovered?: boolean;
  selected?: boolean;
}
