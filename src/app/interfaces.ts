export interface ITabGroup {
  id: number;
  tabs: ITab[];
  selectedTab: number;
  scrollingMode: boolean;
}

export interface ITab {
  id: number;
  title: string;
  transitions: ITransition[];
  left: number;
  width: number;
  pinned: boolean;
}

export interface IPage {
  id: number;
  url: string;
}

export interface ITransition {
  property: string;
  duration: number;
  easing?: string;
}
