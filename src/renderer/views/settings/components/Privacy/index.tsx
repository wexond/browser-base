import * as React from 'react';

import { Header } from '../App/style';
import { Button } from '~/renderer/components/Button';
import store from '../../store';
import { BLUE_500 } from '~/renderer/constants';

const onClearBrowsingData = () => {
  store.dialogContent = 'privacy';
};

const DoNotTrack = observer(() => {
  const { doNotTrack } = store.settings;

  return (
    <Row onClick={onSwitchChange('doNotTrack')}>
      <Title>Send Do Not Track requests</Title>
      <Control>
        <Switch value={doNotTrack} />
      </Control>
    </Row>
  );
});

const AsksBeforeRedirect = observer(() => {
  const { asksBeforeRedirect } = store.settings;

  return (
    <Row onClick={onSwitchChange('asksBeforeRedirect')}>
      <Title>Ask for confirmation when a website tries to redirect me</Title>
      <Control>
        <Switch value={doNotTrack} />
      </Control>
    </Row>
  );
});

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
