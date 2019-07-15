import * as React from 'react';

import { Content } from '../../../style';
import { Header } from '../style';
import { Button } from '~/renderer/components/Button';
import { colors } from '~/renderer/constants';
import store from '~/renderer/views/app/store';

const onClearBrowsingData = () => {
  store.overlay.dialogContent = 'privacy';
};

export const Privacy = () => {
  return (
    <Content>
      <Header>Privacy</Header>
      <Button
        type="outlined"
        foreground={colors.blue['500']}
        onClick={onClearBrowsingData}
      >
        Clear browsing data
      </Button>
    </Content>
  );
};
