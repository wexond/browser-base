import Mousetrap from 'mousetrap';

import { KeyBinding } from '../interfaces';
import { Commands } from '../defaults';
import database from '../database';

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

export const getKeyBindings = async (json: any) => {
  const bindings: KeyBinding[] = parseKeyBindings(json);
  const bindingsInDB = await database.keyBindings.toArray();

  for (let i = 0; i < bindingsInDB.length; i++) {
    const bind = bindings.filter(r => r.command === bindingsInDB[i].command);

    if (bind.length > 0) {
      bind[0].defaultKey = bindings[0].key;
      bind[0].key = bindingsInDB[i].key;
    }
  }

  console.log(bindings);

  return bindings;
};

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    Mousetrap.bind(binding.key, Commands[binding.command]);
  }
};
