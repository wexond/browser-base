import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { ipcRenderer } from 'electron';
import { StyledApp, Title, Permissions, Permission, Buttons } from './style';
import store from '../../store';
import { Button } from '~/renderer/components/Button';

const GlobalStyle = createGlobalStyle`${Style}`;

const sendResult = (r: boolean) => {
  ipcRenderer.send('request-permission-result', r);
};

const getText = (permission: string) => {
  if (permission === 'notifications') {
    return 'Show notifications';
  }

  if (permission === 'microphone') {
    return 'Access your microphone';
  }

  if (permission === 'camera') {
    return 'Access your camera';
  }

  if (permission === 'geolocation') {
    return 'Know your location';
  }

  return '';
};

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <Title>{store.domain} wants to:</Title>
      <Permissions>
        {store.permissions.map(item => (
          <Permission key={item}>{getText(item)}</Permission>
        ))}
      </Permissions>
      <Buttons>
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          onClick={() => sendResult(true)}
        >
          Allow
        </Button>
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          style={{ marginLeft: 8 }}
          onClick={() => sendResult(false)}
        >
          Deny
        </Button>
      </Buttons>
      <div style={{ clear: 'both' }}></div>
    </StyledApp>
  );
});
