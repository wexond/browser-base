import store from '@app/store';

interface Commands {
  [key: string]: () => void;
}

export const commands: Commands = {
  'tabs.switch': (e?: KeyboardEvent) => {
    const { tabs } = store.tabsStore.getCurrentGroup();

    // 0
    if (e.keyCode === 48) {
      tabs[tabs.length - 1].select();
    } else {
      // 1-9
      const index = e.keyCode - 49;

      if (tabs.length > index) {
        tabs[index].select();
      }
    }
  },
  'tabs.new': () => {
    store.tabsStore.addTab();
  },
  'tabs.reload': () => {
    store.pagesStore.getSelected().webview.reload();
  },
  'tabs.back': () => {
    store.pagesStore.getSelected().webview.goBack();
  },
  'tabs.forward': () => {
    store.pagesStore.getSelected().webview.goForward();
  },
  'tabs.home': () => {
    store.pagesStore.getSelected().webview.loadURL('wexond://newtab');
  },
  'tabGroups.show': () => {
    store.tabsStore.menuVisible = true;
  },
  'history.show': () => {},
  'menu.show': () => {
    store.menuStore.visible = true;
  },
  'bookmarks.show': () => {},
  'wexond.hideAllMenu': () => {
    store.menuStore.visible = false;
    store.tabsStore.menuVisible = false;
    store.bookmarksStore.dialogVisible = false;
    store.pageMenuStore.visible = false;
    store.addressBarStore.toggled = false;
  },
};
