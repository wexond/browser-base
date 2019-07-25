import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { Button } from '~/renderer/components/Button';
import { Style } from '../../style';
import { StyledApp, Title, Buttons, Container } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

const onSave = () => {
  const username = store.usernameRef.current.value.trim();
  const password = store.passwordRef.current.value.trim();

  ipcRenderer.send('credentials-save', username, password);
  ipcRenderer.send('credentials-hide');
};

const onClose = () => {
  ipcRenderer.send('credentials-hide');
};

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <Title>Save password?</Title>
      <Container>
        <Textfield ref={store.usernameRef} label="Username" />
        <PasswordInput ref={store.passwordRef} />
      </Container>
      <Buttons>
        <Button
          onClick={onSave}
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
        >
          Save
        </Button>
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
