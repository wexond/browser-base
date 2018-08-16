import fs from 'fs';
import Mousetrap from 'mousetrap';

import { Commands, defaultPaths } from '../defaults';
import { KeyBinding } from '../interfaces';
import { getPath } from './paths';

const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const bindKeys = (bindings: KeyBinding[], reset = true) => {
  Mousetrap.reset();

  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    const digitIndex = binding.key.indexOf('digit');

    if (digitIndex === -1) {
      Mousetrap.bind(binding.key, Commands[binding.command]);
    } else {
      const firstPart = binding.key.substring(0, digitIndex);

      for (let x = 0; x <= 9; x++) {
        Mousetrap.bind(firstPart + x, Commands[binding.command]);
      }
    }
  }
};

export const getKeyBindings = async () => {
  const list: KeyBinding[] = [];
  const data = fs.readFileSync(getPath(defaultPaths.keyBindings), 'utf8');
  const userBindings = JSON.parse(data);

  for (const binding of defaultKeyBindings as KeyBinding[]) {
    const userBinding: KeyBinding = userBindings.filter(
      (r: any) => r.command === binding.command,
    )[0];

    if (userBinding != null) binding.key = userBinding.key;
    binding.isChanged = userBinding != null;

    list.push(binding as KeyBinding);
  }

  return list;
};
