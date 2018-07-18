import Store from '../store';

export const getParentFolder = (folder: any, folders: any = Store.data.folders, parent?: any) => {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i] === folder) {
      return parent;
    }

    const p: any = getParentFolder(folder, folders[i].folders, folders[i]);
    if (p != null) return p;
  }

  return null;
};

export const getFolderPath = (folder: any) => {
  const titles = [];
  let lastChild = folder;

  while (true) {
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
