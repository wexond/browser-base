import { writeFileSync, readFileSync } from 'fs';
import Mousetrap from 'mousetrap';

import { commands } from '~/defaults/commands';
import { defaultPaths } from '~/defaults';
import { KeyBinding } from '../interfaces';
import { getPath } from './paths';
import store from '@app/store';

const defaultKeyBindings = require('../../static/defaults/key-bindings.json');

export const bindKeys = (bindings: KeyBinding[]) => {
  for (const binding of bindings) {
    if (!binding.key.includes('digit')) {
      Mousetrap.bind(binding.key, commands[binding.command]);
    } else {
      for (let i = 0; i <= 9; i++) {
        Mousetrap.bind(
          binding.key.replace('digit', i),
          commands[binding.command],
        );
      }
    }
  }
};

export const getKeyBindings = async () => {
  const list: KeyBinding[] = [];
  const data = readFileSync(getPath(defaultPaths.keyBindings), 'utf8');
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

export const saveKeyBindings = () => {
  const path = getPath(defaultPaths.keyBindings);
  const changed = store.keyBindingsStore.keyBindings.filter(e => e.isChanged);

  writeFileSync(path, JSON.stringify(changed, null, 2), 'utf8');
};
