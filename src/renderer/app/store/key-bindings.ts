import { readFileSync } from 'fs';
import Mousetrap from 'mousetrap';

import { KeyBinding } from '~/shared/interfaces';
import { getPath } from '~/shared/utils/paths';
import { commands } from '@/constants/app';
import { defaultPaths } from '@/constants/paths';

const defaultKeyBindings = require('../../../../static/defaults/key-bindings.json');

export class KeyBindings {
  public load = () => {
    const data = readFileSync(getPath(defaultPaths.keyBindings), 'utf8');
    const userBindings = JSON.parse(data);

    for (const binding of defaultKeyBindings as KeyBinding[]) {
      const userBinding: KeyBinding = userBindings.filter(
        (r: any) => r.command === binding.command,
      )[0];

      if (userBinding != null) {
        binding.key = userBinding.key;
      }

      binding.isChanged = userBinding != null;

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
}
