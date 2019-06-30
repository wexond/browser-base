export interface IDownloadItem {
  fileName?: string;
  receivedBytes?: number;
  totalBytes?: number;
  savePath?: string;
  id?: string;
  completed?: boolean;
}
