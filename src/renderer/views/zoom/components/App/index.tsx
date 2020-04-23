import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { StyledApp, Label, Buttons, Spacer } from './style';
import { ToolbarButton } from '../../../app/components/ToolbarButton';
import store from '../../store';
import { Button } from '~/renderer/components/Button';
import { ipcRenderer, remote } from 'electron';
import { UIStyle } from '~/renderer/mixins/default-styles';

import {
  ICON_UP,
  ICON_DOWN,
} from '~/renderer/constants/icons';

const onPlus = () => {
  // TODO
};

const onMinus = () => {
  // TODO
};

const onReset = () => {
  // TODO
};

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider theme={{ ...store.theme }}>
        <StyledApp visible={store.visible}>
          <UIStyle />
          <Buttons>
            <ToolbarButton
              toggled={false}
              icon={ICON_UP}
              size={18}
              dense
              iconStyle={{ transform: 'scale(-1,1)' }}
              onClick={onPlus}
            />
            <Label>{store.zoomFactor * 100 + "%"}</Label>
            <ToolbarButton
              toggled={false}
              icon={ICON_DOWN}
              size={18}
              dense
              iconStyle={{ transform: 'scale(-1,1)' }}
              onClick={onMinus}
            />
            <Spacer />
            <Button
              onClick={onReset}
              background={
                store.theme['dialog.lightForeground']
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)'
              }
              foreground={
                store.theme['dialog.lightForeground'] ? 'white' : 'black'
              }
            >
              Reset
            </Button>
          </Buttons>
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
