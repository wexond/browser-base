const isObject = (item: any) => typeof item === 'object';

export const merge = (target: any, source: any, onlyNotExisting = false): any => {
  target = { ...target };

  if (source == null) {
    return target;
  }

  source = { ...source };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: string) => {
      if (isObject(source[key])) {
        if (target[key] == null) {
          target[key] = source[key];
        } else {
          target[key] = merge(target[key], source[key], onlyNotExisting);
        }
      } else if (!onlyNotExisting || (target[key] == null || target[key] === '')) {
        target[key] = source[key];
      }
    });
  }

  return target;
};
