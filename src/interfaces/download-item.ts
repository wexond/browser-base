export interface IDownloadItem {
  fileName?: string;
  receivedBytes?: number;
  totalBytes?: number;
  savePath?: string;
  url?: string;
  id?: string;
  completed?: boolean;
  paused?: boolean;
  canceled?: boolean;
  menuIsOpen?: boolean;
  openWhenDone?: boolean;
}

export interface IElectronDownloadItem {
  item?: Electron.DownloadItem;
  webContents?: Electron.WebContents;
  id?: string;
}
