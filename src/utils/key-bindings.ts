import Store from '../renderer/store';
import { KeyBinding } from '../interfaces';
import { Commands } from '../defaults';

export const parseKeyBindings = (json: any) => {
  const list: KeyBinding[] = [];

  for (let i = 0; i < json.length; i++) {
    const item = json[i];
    const isRange = item.keyMinRange != null && item.keyMaxRange != null;

    if (item.command != null && (item.key != null || isRange)) {
      const keyBinding: KeyBinding = {
        key: item.key,
        keyMinRange: item.keyMinRange,
        keyMaxRange: item.keyMaxRange,
        altKey: item.altKey || false,
        ctrlKey: item.ctrlKey || false,
        metaKey: item.metaKey || false,
        command: item.command,
        isRange,
      };

      list.push(keyBinding);
    }
  }

  return list;
};

export const handleKeyBindings = (e: KeyboardEvent) => {
  if (!e.isTrusted) return;

  console.log(e.code);

  if (e.type === 'keydown') {
    for (let i = 0; i < Store.keyBindings.length; i++) {
      const binding = Store.keyBindings[i];

      if (
        binding.altKey !== e.altKey
        || binding.ctrlKey !== e.ctrlKey
        || binding.metaKey !== e.metaKey
      ) {
        return;
      }

      if (
        (!binding.isRange && e.code === binding.key)
        || (binding.isRange && e.keyCode >= binding.keyMinRange && e.keyCode <= binding.keyMaxRange)
      ) {
        Commands[binding.command](e.keyCode);
        return;
      }
    }
  }
};
