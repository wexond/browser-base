import { observable } from 'mobx';
import Workspace from './workspace';

export default class Workspaces {
  @observable public visible = false;

  @observable public list = [new Workspace()];
}
