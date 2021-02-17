import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledApp, Title, Permissions, Permission, Buttons } from './style';
import store from '../../store';
import { Button } from '~/renderer/components/Button';
import { UIStyle } from '~/renderer/mixins/default-styles';

const sendResult = (r: boolean) => {
  store.send('result', r);
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
    <ThemeProvider theme={{ ...store.theme }}>
      <StyledApp>
        <UIStyle />
        <Title>{store.domain} wants to:</Title>
        <Permissions>
          {store.permissions.map((item) => (
            <Permission key={item}>{getText(item)}</Permission>
          ))}
        </Permissions>
        <Buttons>
          <Button
            background={
              store.theme['dialog.lightForeground']
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)'
            }
            foreground={
              store.theme['dialog.lightForeground'] ? 'white' : 'black'
            }
            onClick={() => sendResult(true)}
          >
            Allow
          </Button>
          <Button
            background={
              store.theme['dialog.lightForeground']
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)'
            }
            foreground={
              store.theme['dialog.lightForeground'] ? 'white' : 'black'
            }
            style={{ marginLeft: 8 }}
            onClick={() => sendResult(false)}
          >
            Deny
          </Button>
        </Buttons>
        <div style={{ clear: 'both' }}></div>
      </StyledApp>
    </ThemeProvider>
  );
});
