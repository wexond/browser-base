export interface DownloadItem {
  fileName?: string;
  receivedBytes?: number;
  totalBytes?: number;
  savePath?: string;
  id?: string;
  completed?: boolean;
}
