import * as React from 'react';

import { Switch } from '~/renderer/components/Switch';
import { Title, Row, Control, Header } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';
import { Button } from '~/renderer/components/Button';

const AskToggle = () => {
  const { suggestions } = store.settings;

  return (
    <Row onClick={onSwitchChange('suggestions')}>
      <Title>Show search and site suggestions</Title>
      <Control>
        <Switch value={suggestions} />
      </Control>
    </Row>
  );
};

const Location = () => {
  return (
    <Row>
      <Title>Location</Title>
      <Control>
        <Button
          background={
            store.theme['dialog.lightForeground']
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.08)'
          }
          foreground={store.theme['dialog.lightForeground'] ? 'white' : 'black'}
        >
          Change
        </Button>
      </Control>
    </Row>
  );
};

export const Downloads = () => {
  return (
    <>
      <Header>Downloads</Header>
      <Location />
      <AskToggle />
    </>
  );
};
