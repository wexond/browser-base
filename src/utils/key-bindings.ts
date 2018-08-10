import Mousetrap from 'mousetrap';

import { KeyBinding } from '../interfaces';
import { Commands } from '../defaults';
import database from '../database';

const keyBindingsJSON = require('../../static/defaults/key-bindings.json');

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    Mousetrap.bind(binding.key, Commands[binding.command]);
  }
};

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

export const getKeyBindingByCommand = (list: KeyBinding[], command: string) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].command === command) {
      return list[i];
    }
  }

  return null;
};

export const getKeyBindings = async () => {
  const list = parseKeyBindings(keyBindingsJSON);
  const bindings = await database.keyBindings.toArray();

  for (let i = 0; i < list.length; i++) {
    const bind = getKeyBindingByCommand(bindings, list[i].command);

    if (bind != null) {
      list[i].defaultKey = list[i].key;
      list[i].key = bind.key;
    }
  }

  return list;
};
