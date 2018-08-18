export const selectWorkspace = (id: number) => {
  store.currentWorkspace = id;
  requestAnimationFrame(() => {
    updateTabsBounds(false);
  });
};

let id = 0;

export const createWorkspace = () => {
  const workspace: Workspace = {
    id: id++,
    selectedTab: -1,
    name: 'New workspace',
  };
  store.workspaces.push(workspace);
  store.currentWorkspace = workspace.id;
  createTab();
};
