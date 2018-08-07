import Store from '../renderer/store';

export const Commands: any = {
  'tabs.switch': (keyCode?: number) => {
    const current = Store.getCurrentWorkspace();
    const tabs = current.tabs;

    if (keyCode === 48) {
      // 0
      current.selectTab(tabs[tabs.length - 1]);
    } else {
      // 1-9
      const index = keyCode - 49;

      if (tabs.length > index) {
        current.selectTab(tabs[index]);
      }
    }
  },
  'workspaces.show': () => {
    Store.workspacesMenuVisible = true;
  },
};
