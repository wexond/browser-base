import { observable } from 'mobx';

export class TabGroup {
  @observable
  public id: number;

  @observable
  public name: string;

  @observable
  public selectedTab: number;
}
