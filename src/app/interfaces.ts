export interface ITabGroup {
  id: number;
  tabs: ITab[];
  selectedTab: number;
}

export interface ITab {
  id: number;
  title: string;
  transitions: ITransition[];
  left: number;
  width: number;
  pinned: boolean;
}

export interface ITransition {
  property: string;
  duration: number;
  easing?: string;
}
