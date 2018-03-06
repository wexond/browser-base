import { intercept, observable, observe } from "mobx";
import App from "./components";
import Tab from "./components/Tab";

export default new class Store {
  @observable public tabGroups: any[] = [];
  @observable public addTabLeft: number = 0;
  @observable public selectedTab: number = -1;
  @observable
  public tabDragData: {
    mouseClickX?: number;
    left?: number;
    isMouseDown?: boolean;
    tab?: Tab;
  } = {};
  @observable public tabAnimateLeft: boolean = true;
  @observable public tabAnimateWidth: boolean = true;

  @observable public foreground: string = "black";
  @observable public backgroundColor: string = "#fff";
  @observable public border: boolean = true;

  @observable public currentTabGroup: number = 0;
  @observable public editingTabGroup: number = -1;
  @observable public isFullscreen: boolean = false;

  @observable public extensions: any[] = [];

  @observable public dictionary: any;

  public url: string = "";
  public certificates: any[] = [];

  public pageMenuData = {};
  public cursor: { x: number; y: number } = { x: 0, y: 0 };
  public app: App;
  public lastClosedURL: string;
}();
