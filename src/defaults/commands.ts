import store from '@app/store';

interface Commands {
  [key: string]: () => void;
}

export const commands: Commands = {
  'tabs.switch': (e?: KeyboardEvent) => {
    const { tabs } = store.tabsStore.getCurrent();

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
    console.log('home');
  },
  'tabGroups.show': () => {
    store.tabsStore.menuVisible = true;
  },
  'history.show': () => {
    store.menuStore.visible = true;
    store.menuStore.selectedItem = 0;
  },
  'menu.show': () => {
    store.menuStore.visible = true;
  },
  'bookmarks.show': () => {
    store.menuStore.visible = true;
    store.menuStore.selectedItem = 1;
  },
  'wexond.hideAllMenu': () => {
    store.menuStore.hide();
    store.tabsStore.menuVisible = false;
    store.bookmarksStore.dialogVisible = false;
    store.pageMenuStore.visible = false;
  },
};
