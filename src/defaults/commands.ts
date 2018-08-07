import Store from '../renderer/store';

export const Commands: any = {
  'tabs.switch': (e?: KeyboardEvent) => {
    const current = Store.getCurrentWorkspace();
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
  'workspaces.show': () => {
    Store.workspacesMenuVisible = true;
  },
};
