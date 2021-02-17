import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';

import { StyledApp, Label, Buttons, Spacer } from './style';
import { ToolbarButton } from '../../../app/components/ToolbarButton';
import store from '../../store';
import { Button } from '~/renderer/components/Button';
import { ipcRenderer } from 'electron';
import { UIStyle } from '~/renderer/mixins/default-styles';

import { ICON_UP, ICON_DOWN } from '~/renderer/constants/icons';

const onPlus = () => {
  ipcRenderer.send('change-zoom', 'in');
};

const onMinus = () => {
  ipcRenderer.send('change-zoom', 'out');
};

const onReset = () => {
  ipcRenderer.send('reset-zoom');
};

ipcRenderer.on('zoom-factor-updated', (e, zoomFactor) => {
  store.zoomFactor = zoomFactor;
});

export const App = observer(() => {
  return (
    <ThemeProvider theme={{ ...store.theme }}>
      <StyledApp
        visible={store.visible}
        onMouseEnter={() => store.stopHideTimer()}
        onMouseLeave={() => store.resetHideTimer()}
      >
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
          <Label>{(store.zoomFactor * 100).toFixed(0) + '%'}</Label>
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
});
