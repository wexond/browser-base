import { observable } from 'mobx';

export class NewsStore {
  @observable
  public newsColumns: any[][] = [];

  @observable
  public newsData: any[] = [];
}
