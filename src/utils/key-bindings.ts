import Store from '../renderer/store';
import { KeyBinding } from '../interfaces';
import { Commands } from '../defaults';

export const parseKeyBindings = (json: any) => {
  const list: KeyBinding[] = [];

  for (let i = 0; i < json.length; i++) {
    const item = json[i];

    if (item.command != null && item.key != null) {
      const keyBinding: KeyBinding = {
        key: item.key.toLowerCase(),
        altKey: item.altKey || false,
        ctrlKey: item.ctrlKey || false,
        metaKey: item.metaKey || false,
        command: item.command,
        when: item.when,
      };

      list.push(keyBinding);
    }
  }

  return list;
};

export const handleKeyBindings = (e: KeyboardEvent) => {
  if (!e.isTrusted) return;

  if (e.type === 'keydown') {
    for (let i = 0; i < Store.keyBindings.length; i++) {
      const binding = Store.keyBindings[i];

      if (
        binding.key === e.key.toLowerCase()
        && binding.altKey === e.altKey
        && binding.ctrlKey === e.ctrlKey
        && binding.metaKey === e.metaKey
      ) {
        Commands[binding.command]();
        return;
      }
    }
  }
};
