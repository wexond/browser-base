import store from '../renderer/store';

export const Commands: any = {
  'tabs.switch': (e?: KeyboardEvent) => {
    const current = store.getCurrentWorkspace();
    const tabs = current.tabs;

    // 0
    if (e.keyCode === 48) {
      current.selectTab(tabs[tabs.length - 1]);
    } else {
      // 1-9
      const index = e.keyCode - 49;

      if (tabs.length > index) {
        current.selectTab(tabs[index]);
      }
    }
  },
  'tabs.new': () => {
    store.getCurrentWorkspace().addTab();
  },
  'tabs.reload': () => {
    store.getSelectedPage().webview.reload();
  },
  'tabs.back': () => {
    store.getSelectedPage().webview.goBack();
  },
  'tabs.forward': () => {
    store.getSelectedPage().webview.goForward();
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
