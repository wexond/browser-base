import { moveIndicatorToSelectedTab, updateTabsBounds } from '.';
import { Workspace } from '../interfaces';
import store from '../renderer/store';
import { createTab } from './tabs';

export const getWorkspaceById = (id: number) =>
  store.workspaces.find(x => x.id === id);

export const getCurrentWorkspace = () =>
  getWorkspaceById(store.currentWorkspace);

export const getWorkspaceTabs = (workspaceId: number) =>
  store.tabs.filter(x => x.workspaceId === workspaceId);

export const getCurrentWorkspaceTabs = () =>
  getWorkspaceTabs(getCurrentWorkspace().id);

export const selectWorkspace = (id: number) => {
  store.currentWorkspace = id;
  requestAnimationFrame(() => {
    updateTabsBounds(false);
    moveIndicatorToSelectedTab(false);
  });
};

export const removeWorkspace = (id: number) =>
  (store.workspaces = store.workspaces.filter(x => x.id !== id));

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
