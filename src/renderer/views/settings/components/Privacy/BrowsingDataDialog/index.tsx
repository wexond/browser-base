import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Dialog, Title, Content, Buttons, CloseButton } from '../../Dialog';
import { Button } from '~/renderer/components/Button';
import store from '../../../store';

export default observer(() => {
  return (
    <Dialog visible={store.dialogContent === 'privacy'} style={{ width: 344 }}>
      <Title>Clear browsing data</Title>
      <Content></Content>
      <Buttons>
        <CloseButton />
        <Button background="transparent" foreground="#3F51B5">
          CLEAR DATA
        </Button>
      </Buttons>
    </Dialog>
  );
});
