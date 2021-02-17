import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { Button } from '~/renderer/components/Button';
import List from '../List';
import { BLUE_500 } from '~/renderer/constants';
import { StyledApp, Title, Buttons, Container } from './style';
import { UIStyle } from '~/renderer/mixins/default-styles';

const onSave = () => {
  const username = store.usernameRef.current.value.trim();
  const password = store.passwordRef.current.value.trim();

  ipcRenderer.send(`credentials-hide-${store.windowId}`);

  ipcRenderer.send(`credentials-save-${store.windowId}`, {
    username,
    password,
    update: store.content === 'update',
    oldUsername: store.oldUsername,
  });
};

const onClose = () => {
  ipcRenderer.send(`credentials-hide-${store.windowId}`);
};

const Fields = observer(() => {
  return (
    <div style={{ display: store.content !== 'list' ? 'block' : 'none' }}>
      <Textfield ref={store.usernameRef} label="Username" />
      <PasswordInput ref={store.passwordRef} />
    </div>
  );
});

export const App = observer(() => {
  let title = '';

  if (store.content === 'list') {
    title = store.list.length
      ? 'Saved passwords for this site'
      : 'No passwords saved for this site';
  } else {
    title = store.content === 'save' ? 'Save password?' : 'Update password?';
  }

  return (
    <StyledApp>
      <UIStyle />
      <Title>{title}</Title>
      <Container>
        <Fields />
        <List />
      </Container>
      <Buttons>
        {store.content !== 'list' && (
          <Button
            onClick={onSave}
            foreground="black"
            background="rgba(0, 0, 0, 0.08)"
            style={{ marginLeft: 'auto' }}
          >
            Save
          </Button>
        )}
        {store.content === 'list' && (
          <Button
            foreground={BLUE_500}
            background="transparent"
            style={{ marginRight: 'auto', padding: '0px 12px' }}
            onClick={onClose}
          >
            Manage passwords
          </Button>
        )}
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          onClick={onClose}
          style={{ marginLeft: 8 }}
        >
          Close
        </Button>
      </Buttons>
      <div style={{ clear: 'both' }}></div>
    </StyledApp>
  );
});
