import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '../../style';
import { Button } from '~/renderer/components/Button';
import store from '../../store';
import { Textfield } from '~/renderer/components/Textfield';
import { PasswordInput } from '~/renderer/components/PasswordInput';
import { StyledApp, Title, Buttons, Subtitle } from './style';

const GlobalStyle = createGlobalStyle`${Style}`;

const ref1 = React.createRef<Textfield>();
const ref2 = React.createRef<PasswordInput>();

const sendResponse = (credentials: any) => {
  ipcRenderer.send('request-auth-result', credentials);
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
    <StyledApp>
      <GlobalStyle />
      <Title>Login</Title>
      <Subtitle>{store.url}</Subtitle>
      <Textfield
        ref={ref1}
        test={str => str.trim().length !== 0}
        style={{ width: '100%', marginTop: 16 }}
        label="Username"
      ></Textfield>
      <PasswordInput
        ref={ref2}
        style={{ width: '100%', marginTop: 16 }}
      ></PasswordInput>
      <Buttons>
        <Button onClick={onClick}>Login</Button>
        <Button
          foreground="black"
          background="rgba(0, 0, 0, 0.08)"
          style={{ marginLeft: 8 }}
          onClick={() => sendResponse(null)}
        >
          Cancel
        </Button>
      </Buttons>
      <div style={{ clear: 'both' }}></div>
    </StyledApp>
  );
});
