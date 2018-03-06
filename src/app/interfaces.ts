export interface ITabGroup {
  id: number;
  tabs: ITab[];
  selectedTab: number;
}

export interface ITab {
  id: number;
  title: string;
}
