export interface ITabGroup {
  id: number;
  tabs: ITab[];
  selectedTab: number;
  scrollingMode: boolean;
  containerWidth: number;
}

export interface ITab {
  id: number;
  title: string;
  left: number;
  width: number;
  pinned: boolean;
  isRemoving?: boolean;
}

export interface IPage {
  id: number;
  url: string;
}

export interface IAddTabButton {
  left: number | "auto";
}
