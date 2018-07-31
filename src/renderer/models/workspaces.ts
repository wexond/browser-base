import { observable } from 'mobx';
import Workspace from './workspace';

export default class Workspaces {
  @observable public visible = false;

  @observable public selected = 0;

  @observable public list = [new Workspace()];

  @observable public inputVisible: boolean = false;

  public timer: any;

  public hide = () => {
    this.visible = false;
  };
}
