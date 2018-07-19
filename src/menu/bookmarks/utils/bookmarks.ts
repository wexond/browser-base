import Store from '../store';

import FolderModel from '../models/folder';

export const getParentFolder = (
  folder: FolderModel,
  folders: FolderModel[] = Store.data.folders,
  parent?: FolderModel,
) => {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i] === folder) {
      return parent;
    }

    const p: FolderModel = getParentFolder(folder, folders[i].folders, folders[i]);
    if (p != null) return p;
  }

  return null;
};

export const getFolderPath = (folder: FolderModel) => {
  if (folder.root) return [];

  const titles = [];
  let lastChild = folder;

  for (;;) {
    const parent = getParentFolder(lastChild);

    if (parent != null) {
      titles.push(parent);
      lastChild = parent;
    } else {
      break;
    }
  }

  titles.reverse();
  titles.push(folder);

  return titles;
};
