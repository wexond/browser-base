import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { Button } from '~/renderer/components/Button';
import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { StyledApp, Title, Buttons, Subtitle } from './style';
import { UIStyle } from '~/renderer/mixins/default-styles';

const ref1 = React.createRef<Textfield>();
const ref2 = React.createRef<PasswordInput>();

const sendResponse = (credentials: any) => {
  store.send('result', credentials);
};

const onClick = () => {
  if (ref1.current.test() && ref2.current.test()) {
    sendResponse({
      username: ref1.current.value,
      password: ref2.current.value,
    });
  }
};

export const App = observer(() => {
  return (
    <ThemeProvider
      theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
    >
      <StyledApp>
        <UIStyle />
        <Title>Login</Title>
        <Subtitle>{store.url}</Subtitle>
        <Textfield
          dark={store.theme['dialog.lightForeground']}
          ref={ref1}
          test={(str) => str.trim().length !== 0}
          style={{ width: '100%', marginTop: 16 }}
          label="Username"
        ></Textfield>
        <PasswordInput
          dark={store.theme['dialog.lightForeground']}
          ref={ref2}
          style={{ width: '100%', marginTop: 16 }}
        ></PasswordInput>
        <Buttons>
          <Button onClick={onClick}>Login</Button>
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
            onClick={() => sendResponse(null)}
          >
            Cancel
          </Button>
        </Buttons>
        <div style={{ clear: 'both' }}></div>
      </StyledApp>
    </ThemeProvider>
  );
});
