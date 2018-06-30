import { observable, observe } from 'mobx';
import Workspace from './workspace';
import Store from '../store';

export default class Workspaces {
  @observable public visible = false;

  @observable public selected = 0;

  @observable public list = [new Workspace()];
}
