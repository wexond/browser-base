import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { ipcRenderer } from 'electron';
import { StyledApp, Title, Permissions, Permission, Buttons } from './style';
import store from '../../store';
import { Button } from '~/renderer/components/Button';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

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
        <Button onClick={() => sendResult(false)}>Deny</Button>
        <Button onClick={() => sendResult(true)}>Allow</Button>
      </Buttons>
    </StyledApp>
  );
});
