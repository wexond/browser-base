import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '@app/store';
import Snackbar from '@/components/Snackbar';
import Button from '@/components/Button';
import { colors } from '@/constants/renderer';
import { UPDATE_RESTART_AND_INSTALL } from '@/constants/ipc-messages';

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
