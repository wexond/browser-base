import Mousetrap from 'mousetrap';

import { Commands } from '../defaults';
import { KeyBinding } from '../interfaces';

export const parseKeyBindings = (json: any) => {
  const list: KeyBinding[] = [];

  for (let i = 0; i < json.length; i++) {
    const item = json[i];

    if (item.command != null && item.key != null) {
      const keyBinding: KeyBinding = {
        key: item.key,
        command: item.command,
      };

      list.push(keyBinding);
    }
  }

  return list;
};

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    Mousetrap.bind(binding.key, Commands[binding.command]);
  }
};
