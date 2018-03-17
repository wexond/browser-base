import Store from "../store";

export const getTabGroupById = (id: number) => {
    return Store.tabGroups.filter(tabGroup => tabGroup.id === id)[0];
}
