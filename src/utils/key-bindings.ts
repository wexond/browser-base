import fs from 'fs';
import Mousetrap from 'mousetrap';

import { KeyBinding } from '../interfaces';
import { Commands } from '../defaults';
import { getPath, compareArrays } from './other';

const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    Mousetrap.bind(binding.key, Commands[binding.command]);
  }
};

export const isKeyBindingChanged = (command: string, key: string) => {
  for (let i = 0; i < defaultKeyBindings.length; i++) {
    const binding = defaultKeyBindings[i];

    if (binding.command === command) {
      if (typeof binding.key === 'object') {
        return !compareArrays(binding.key, key);
      }

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
      continue; // eslint-disable-line
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
