import { observable } from 'mobx';
import store from '.';

export class NavigationStateStore {
  @observable
  public canGoBack: boolean = false;

  @observable
  public canGoForward: boolean = false;

  public refresh() {
    const page = store.pagesStore.getSelectedPage();
    if (page) {
      const { webview } = page;

      if (webview && webview.getWebContents()) {
        this.canGoBack = webview.canGoBack();
        this.canGoForward = webview.canGoForward();
      }
    }
  }
}
