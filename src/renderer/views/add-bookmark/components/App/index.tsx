import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Style } from '../../style';
import { StyledApp, Title, Row, Label, Buttons } from './style';
import store from '../../store';
import { Input } from '~/renderer/components/Input';
import { Dropdown } from '~/renderer/components/Dropdown';
import { getBookmarkTitle } from '~/renderer/views/bookmarks/utils';
import { Button } from '~/renderer/components/Button';

const GlobalStyle = createGlobalStyle`${Style}`;

const onDone = () => {
  store.hide();
};

const onChange = (parent: string) => {
  if (!store.bookmark) return;

  store.updateItem(store.bookmark._id, {
    parent,
  });
};

const onRemove = () => {
  if (!store.bookmark) return;

  store.removeItem(store.bookmark._id);
  store.hide();
};

const onBlur = () => {
  if (!store.bookmark) return;

  const input = store.titleRef.current;

  store.updateItem(store.bookmark._id, {
    title: input.value,
  });
};

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <GlobalStyle />
          <Title>Bookmark added</Title>
          <Row>
            <Label>Name</Label>
            <Input className="textfield" ref={store.titleRef} onBlur={onBlur} />
          </Row>
          <Row>
            <Label>Folder</Label>
            <Dropdown ref={store.dropdownRef} onChange={onChange}>
              {store.folders.map(item => (
                <Dropdown.Item key={item._id} value={item._id}>
                  {getBookmarkTitle(item)}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Row>
          <Buttons>
            <Button onClick={onDone}>Done</Button>
            <Button
              onClick={onRemove}
              background={
                store.theme['dialog.lightForeground']
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)'
              }
              foreground={
                store.theme['dialog.lightForeground'] ? 'white' : 'black'
              }
            >
              Remove
            </Button>
          </Buttons>
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
