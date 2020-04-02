import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import {
  StyledApp,
  StyledFind,
  Input,
  Button,
  Buttons,
  SearchIcon,
  Occurrences,
} from './style';
import store from '../../store';
import { callViewMethod } from '~/utils/view';
import { ICON_UP, ICON_DOWN, ICON_CLOSE } from '~/renderer/constants/icons';
import { UIStyle } from '~/renderer/mixins/default-styles';

const onInput = async () => {
  const { value } = store.findInputRef.current;

  store.findInfo.text = value;

  if (value === '') {
    callViewMethod(store.tabId, 'stopFindInPage', 'clearSelection');
    store.findInfo.occurrences = '0/0';
  } else {
    await callViewMethod(store.tabId, 'findInPage', value);
  }
};

const move = (forward: boolean) => async () => {
  const { value } = store.findInputRef.current;
  if (value === '') return;

  await callViewMethod(store.tabId, 'findInPage', value, {
    forward,
    findNext: true,
  });
};

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    move(true)();
  }
};

const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape') {
    store.hide();
  }
};

export const App = observer(() => {
  return (
    <ThemeProvider
      theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
    >
      <StyledApp>
        <UIStyle />
        <StyledFind onKeyUp={onKeyUp}>
          <SearchIcon />
          <Input
            autoFocus
            value={store.findInfo.text}
            onKeyPress={onKeyPress}
            onChange={onInput}
            ref={store.findInputRef}
            placeholder="Find in page"
          />
          <Occurrences>{store.findInfo.occurrences}</Occurrences>
          <Buttons>
            <Button onClick={move(false)} icon={ICON_UP} size={20} />
            <Button onClick={move(true)} icon={ICON_DOWN} size={20} />
            <Button onClick={() => store.hide()} icon={ICON_CLOSE} size={16} />
          </Buttons>
        </StyledFind>
      </StyledApp>
    </ThemeProvider>
  );
});
