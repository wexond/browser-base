import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { createGlobalStyle } from 'styled-components';

import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { Button } from '~/renderer/components/Button';
import List from '../List';
import { Style } from '../../style';
import { StyledApp, Title, Buttons, Container } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

const onSave = () => {
  const username = store.usernameRef.current.value.trim();
  const password = store.passwordRef.current.value.trim();

  ipcRenderer.send('credentials-hide');

  ipcRenderer.send('credentials-save', {
    username,
    password,
    update: store.content === 'update',
    oldUsername: store.oldUsername,
  });
};

const onClose = () => {
  ipcRenderer.send('credentials-hide');
};

const Fields = observer(() => {
  return <>
    <Textfield ref={store.usernameRef} label="Username" />
    <PasswordInput ref={store.passwordRef} />
  </>;
});

export const App = observer(() => {
  let title = 'Saved passwords for this site';

  if (store.content !== 'list') {
    title = `${store.content === 'save' ? 'Save' : 'Update'} password?`;
  }

  return (
    <StyledApp>
      <GlobalStyle />
      <Title>{title}</Title>
      <Container>
        {store.content === 'list' ? <List /> : <Fields />}
      </Container>
      <Buttons>
        {store.content !== 'list' && <Button
          onClick={onSave}
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
        >
          Save
        </Button>}
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          style={{ marginLeft: 8 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Buttons>
      <div style={{ clear: 'both' }}></div>
    </StyledApp>
  );
});
