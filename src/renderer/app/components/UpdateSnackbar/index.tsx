import React from 'react';
import { ipcRenderer } from 'electron';

import Snackbar from '@components/Snackbar';
import store from '@app/store';
import Button from '@components/Button';
import { colors } from '~/renderer/defaults';
import { UPDATE_RESTART_AND_INSTALL } from '~/constants';

export default class UpdateSnackbar extends React.Component {
  public onRestartClick = () => {
    store.updateInfo.available = false;
    ipcRenderer.send(UPDATE_RESTART_AND_INSTALL);
  };

  public render() {
    return (
      <Snackbar visible={store.updateInfo.available}>
        <Snackbar.Content>An update is available</Snackbar.Content>
        <Snackbar.Actions>
          <Button
            text
            foreground={colors.blue['500']}
            onClick={this.onRestartClick}
          >
            RESTART
          </Button>
        </Snackbar.Actions>
      </Snackbar>
    );
  }
}
