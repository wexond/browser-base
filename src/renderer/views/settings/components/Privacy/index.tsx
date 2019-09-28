import * as React from 'react';

import { Header } from '../App/style';
import { Button } from '~/renderer/components/Button';
import store from '../../store';
import { BLUE_500 } from '~/renderer/constants';

const onClearBrowsingData = () => {
  store.dialogContent = 'privacy';
};

export const Privacy = () => {
  return (
    <>
      <Header>Privacy</Header>
      <Button
        type="outlined"
        foreground={BLUE_500}
        onClick={onClearBrowsingData}
      >
        Clear browsing data
      </Button>
    </>
  );
};
