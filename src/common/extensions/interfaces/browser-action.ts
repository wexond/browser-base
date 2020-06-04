export type IconType = string | { [key: string]: string };

export interface IBrowserActionInfo {
  icon?: IconType;
  popup?: string;
  title?: string;
  badgeText?: string;
  tabId?: number;
  badgeBackgroundColor?: string | number[];
}

export interface IBrowserAction extends IBrowserActionInfo {
  extensionId: string;
  tabs?: Map<number, IBrowserActionInfo>;
}
