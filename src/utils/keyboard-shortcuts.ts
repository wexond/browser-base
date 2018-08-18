import fs from 'fs';
import Mousetrap from 'mousetrap';

import { commands } from '~/defaults/commands';
import { KeyBinding } from '~/interfaces';
import { getPath } from './paths';

const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    const digitIndex = binding.key.indexOf('digit');

    if (digitIndex === -1) {
      Mousetrap.bind(binding.key, commands[binding.command]);
    } else {
      const firstPart = binding.key.substring(0, digitIndex);

      for (let x = 0; x <= 9; x++) {
        Mousetrap.bind(firstPart + x, commands[binding.command]);
      }
    }
  }
};

export const isKeyBindingChanged = (command: string, key: string) => {
  for (let i = 0; i < defaultKeyBindings.length; i++) {
    const binding = defaultKeyBindings[i];

    if (binding.command === command && typeof binding.key === 'string') {
      return binding.key !== key;
    }
  }

  return null;
};

export const getKeyBindings = async () => {
  const list: KeyBinding[] = [];
  const path = getPath('key-bindings.json');

  const data = fs.readFileSync(path, 'utf8');
  const json = JSON.parse(data);

  for (let i = 0; i < json.length; i++) {
    if (!json[i].command || !json[i].key) {
      continue;
    }

    const isChanged = isKeyBindingChanged(json[i].command, json[i].key);

    const binding: KeyBinding = {
      command: json[i].command,
      key: json[i].key,
      isChanged,
    };

    list.push(binding);
  }

  return list;
};
