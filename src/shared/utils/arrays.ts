export const compareArrays = (first: any, second: any) => {
  if (first.length !== second.length) {
    return false;
  }

  for (let i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) {
      return false;
    }
  }

  return true;
};

export const moveItem = (list: any, oldIndex: number, newIndex: number) => {
  if (newIndex === oldIndex) return list;

  if (newIndex >= list.length) {
    let i = newIndex - list.length + 1;

    while (i--) {
      list.push(undefined);
    }
  }

  list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);

  return list;
};
