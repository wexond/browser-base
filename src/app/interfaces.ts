export interface ITabGroup {
  id: number;
  tabs: ITab[];
  selectedTab: number;
  lineLeft: number;
  lineWidth: number;
  getSelectedTab: () => ITab;
}

export interface ITab {
  id: number;
  title: string;
  left: number;
  width: number;
  pinned: boolean;
  isRemoving: boolean;
  newWidth: number;
  newLeft: number;
  reorderLocked: boolean;
  hovered: boolean;
}

export interface IPage {
  id: number;
  url: string;
}

export interface IAddTabButton {
  left: number | "auto";
}

export interface IAddressBar {
  toggled: boolean;
  canToggle: boolean;
}
