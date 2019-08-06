import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Center, StyledAddressBar } from './style';
import { loadURL } from '../../../utils';
import { isURL } from '~/utils';
import store from '../../../store';

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.which === 13) {
    // Enter.
    e.preventDefault();

    const text = e.currentTarget.value;
    let url = text;

    if (isURL(text) && !text.includes('://')) {
      url = `http://${text}`;
    } else if (!text.includes('://')) {
      url = store.searchEngine.url.replace('%s', text);
    }

    e.currentTarget.value = url;

    loadURL(url);
  }
};

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  store.inputText = e.currentTarget.value;
};

const onFocus = () => {
  store.inputFocused = true;
  requestAnimationFrame(() => {
    store.inputRef.current.select();
  });
};

const onBlur = () => {
  store.inputFocused = false;
  store.inputRef.current.setSelectionRange(0, 0);
};

export const AddressBar = observer(() => {
  return (
    <Center>
      <StyledAddressBar
        placeholder="Search in Google or type an URL"
        onChange={onChange}
        onKeyPress={onKeyPress}
        value={store.inputText}
        onBlur={onBlur}
        onFocus={onFocus}
        ref={store.inputRef}
      />
    </Center>
  );
});
