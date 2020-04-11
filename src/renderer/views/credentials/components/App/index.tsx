import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { hot } from 'react-hot-loader/root';

import store from '../../store';
import { Button } from '~/renderer/components/Button';
import List from '../List';
import { BLUE_500 } from '~/renderer/constants';
import { IAutoFillSavePayload } from '~/interfaces';
import { UIStyle } from '~/renderer/mixins/default-styles';
import { StyledApp, Title, Buttons, Container } from './style';

const onSave = () => {
  const username = store.usernameRef.current.value.trim();
  const password = store.passwordRef.current.value.trim();

  ipcRenderer.send(`credentials-dialog-hide-${store.windowId}`);

  ipcRenderer.send(`credentials-save-${store.windowId}`, {
    username,
    password,
    update: store.content === 'update',
    oldUsername: store.oldUsername,
  } as IAutoFillSavePayload);
};

const onClose = () => {
  ipcRenderer.send(`credentials-dialog-hide-${store.windowId}`);
};

const Fields = observer(() => {
  return (
    <div style={{ display: store.content !== 'list' ? 'block' : 'none' }}>
      <input ref={store.usernameRef} label="Username" />
      <input ref={store.passwordRef} type="password" />
    </div>
  );
});

export const App = hot(
  observer(() => {
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
  }),
);
