import store from '../renderer/store';
import {
  createTab,
  getCurrentWorkspace,
  getCurrentWorkspaceTabs,
  getSelectedPage,
  selectTab,
} from '../utils';

export const Commands: any = {
  'tabs.switch': (e?: KeyboardEvent) => {
    const tabs = getCurrentWorkspaceTabs();

    // 0
    if (e.keyCode === 48) {
      selectTab(tabs[tabs.length - 1]);
    } else {
      // 1-9
      const index = e.keyCode - 49;

      if (tabs.length > index) {
        selectTab(tabs[index]);
      }
    }
  },
  'tabs.new': () => {
    createTab();
  },
  'tabs.reload': () => {
    getSelectedPage().webview.reload();
  },
  'tabs.back': () => {
    getSelectedPage().webview.goBack();
  },
  'tabs.forward': () => {
    getSelectedPage().webview.goForward();
  },
  'tabs.home': () => {
    console.log('home');
  },
  'workspaces.show': () => {
    store.workspacesMenuVisible = true;
  },
  'history.show': () => {
    store.menu.visible = true;
    store.menu.selectedItem = 0;
  },
  'menu.show': () => {
    store.menu.visible = true;
  },
  'wexond.hideAllMenu': () => {
    store.workspacesMenuVisible = false;
    store.menu.visible = false;
    store.menu.selectedItem = null;
    store.bookmarkDialogVisible = false;
    store.pageMenu.toggle(false);
  },
};
