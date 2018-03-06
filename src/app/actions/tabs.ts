import Store from "../store";

let nextTabId = 0;

export const addTab = () => {
  Store.tabGroups[0].tabs.push({
    id: nextTabId,
    title: "New tab"
  })

  Store.tabGroups[0].selectedTab = nextTabId;

  nextTabId += 1;
}