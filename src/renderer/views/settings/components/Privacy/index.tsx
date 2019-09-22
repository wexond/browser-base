import * as React from 'react';

import { Header } from '../App/style';
import { Button } from '~/renderer/components/Button';
import { colors } from '~/renderer/constants';
import store from '../../store';

const onClearBrowsingData = () => {
  store.dialogContent = 'privacy';
};

export const Privacy = () => {
  return (
    <>
      <Header>Privacy</Header>
      <Button
        type="outlined"
        foreground={colors.blue['500']}
        onClick={onClearBrowsingData}
      >
        Clear browsing data
      </Button>
    </>
  );
};
