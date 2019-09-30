import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';
import { remote, ipcRenderer } from 'electron';

import { Style } from '../../style';
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
import { callViewMethod } from '~/utils';
import { icons } from '~/renderer/constants/icons';

const GlobalStyle = createGlobalStyle`${Style}`;

const close = () => {
  callViewMethod(
    store.windowId,
    store.tabId,
    'webContents.stopFindInPage',
    'clearSelection',
  );
  store.occurrences = '0/0';
  store.hide();
  store.visible = false;
  store.updateTabInfo();
  ipcRenderer.send(`window-focus-${store.windowId}`);
};

const onInput = async () => {
  const { value } = store.findInputRef.current;

  store.text = value;

  if (value === '') {
    callViewMethod(
      store.windowId,
      store.tabId,
      'webContents.stopFindInPage',
      'clearSelection',
    );
    store.occurrences = '0/0';
  } else {
    await callViewMethod(
      store.windowId,
      store.tabId,
      'webContents.findInPage',
      value,
    );
  }

  store.updateTabInfo();
};

const move = (forward: boolean) => async () => {
  const { value } = store.findInputRef.current;
  if (value === '') return;

  await callViewMethod(
    store.windowId,
    store.tabId,
    'webContents.findInPage',
    value,
    {
      forward,
      findNext: true,
    },
  );

  store.updateTabInfo();
};

const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    move(true)();
  }
};

const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape') {
    close();
  }
};

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <StyledFind onKeyUp={onKeyUp}>
        <SearchIcon style={{ filter: 'none' }} />
        <Input
          autoFocus
          value={store.text}
          onKeyPress={onKeyPress}
          onChange={onInput}
          ref={store.findInputRef}
          placeholder="Find in page"
        />
        <Occurrences>{store.occurrences}</Occurrences>
        <Buttons>
          <Button onClick={move(false)} icon={icons.up} size={20} />
          <Button onClick={move(true)} icon={icons.down} size={20} />
          <Button onClick={close} icon={icons.close} size={16} />
        </Buttons>
      </StyledFind>
    </StyledApp>
  );
});
