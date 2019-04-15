import * as React from 'react';
import {
  StyledFind,
  Input,
  Button,
  Buttons,
  SearchIcon,
  Occurrences,
} from './style';
import { observer } from 'mobx-react';
import { icons } from '../../constants';
import store from '../../store';

const close = () => {
  const { selectedTab } = store.tabs;
  selectedTab.findVisible = false;
  selectedTab.callViewMethod('webContents.stopFindInPage', 'clearSelection');
  selectedTab.findOccurrences = '0/0';
};

const onInput = async () => {
  const { value } = store.findInputRef.current;
  const { selectedTab } = store.tabs;

  selectedTab.findText = value;

  if (value === '') {
    selectedTab.callViewMethod('webContents.stopFindInPage', 'clearSelection');
    selectedTab.findOccurrences = '0/0';
    return;
  }

  const requestId = await selectedTab.callViewMethod(
    'webContents.findInPage',
    value,
  );
  selectedTab.findRequestId = requestId;
};

const move = (forward: boolean) => async () => {
  const { selectedTab } = store.tabs;
  const { value } = store.findInputRef.current;
  if (value === '') return;

  const requestId = await selectedTab.callViewMethod(
    'webContents.findInPage',
    value,
    {
      forward,
      findNext: true,
    },
  );

  selectedTab.findRequestId = requestId;
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

export const Find = observer(() => {
  const { selectedTab } = store.tabs;

  let value = '';

  if (selectedTab) {
    value = selectedTab.findText;
  }

  return (
    <StyledFind
      visible={selectedTab && selectedTab.findVisible}
      onKeyUp={onKeyUp}
    >
      <SearchIcon style={{ filter: 'none' }} />
      <Input
        autoFocus
        value={value}
        onKeyPress={onKeyPress}
        onChange={onInput}
        ref={store.findInputRef}
        placeholder="Find in page"
      />
      <Occurrences>{selectedTab && selectedTab.findOccurrences}</Occurrences>
      <Buttons>
        <Button onClick={move(false)} icon={icons.up} size={20} />
        <Button onClick={move(true)} icon={icons.down} size={20} />
        <Button onClick={close} icon={icons.close} size={16} />
      </Buttons>
    </StyledFind>
  );
});
