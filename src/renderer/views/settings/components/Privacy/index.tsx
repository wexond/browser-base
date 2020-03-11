import * as React from 'react';

import { Header, Row, Title, Control } from '../App/style';
import { Button } from '~/renderer/components/Button';
import store from '../../store';
import { BLUE_500 } from '~/renderer/constants';
import { observer } from 'mobx-react-lite';
import { onSwitchChange } from '../../utils';
import { Switch } from '~/renderer/components/Switch';

const onClearBrowsingData = () => {
  store.dialogContent = 'privacy';
};

const DoNotTrackToggle = observer(() => {
  const { doNotTrack } = store.settings;

  return (
    <Row onClick={onSwitchChange('doNotTrack')}>
      <Title>
        Send a &quot;Do Not Track&quot; request with your browsing traffic
      </Title>
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
      <DoNotTrackToggle />
    </>
  );
};
