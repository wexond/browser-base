export interface Tab extends Electron.WebContents {
  favicon?: string;
  windowId?: number;
  audible?: boolean;
}
