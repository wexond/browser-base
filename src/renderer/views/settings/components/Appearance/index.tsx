import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../app/components/Overlay/style';
import { Title, Row, Control, Header } from '../../style';
import { onSwitchChange } from '~/renderer/views/app/utils';
import { store } from '../../store';

const onThemeChange = (value: 'Light' | 'Dark') => {
  store.settings.darkTheme = value === 'Dark';
  store.save();
};

const ThemeVariant = () => {
  const defaultValue = store.settings.darkTheme ? 'Dark' : 'Light';

  return (
    <Row>
      <Title>Theme variant</Title>
      <Control>
        <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
          <Dropdown.Item>Light</Dropdown.Item>
          <Dropdown.Item>Dark</Dropdown.Item>
        </Dropdown>
      </Control>
    </Row>
  );
};

const OverlayAnimations = () => {
  const { animations } = store.settings;

  return (
    <Row>
      <Title>Overlay animations</Title>
      <Control>
        <Switch
          onChange={onSwitchChange('animations')}
          defaultValue={animations}
        />
      </Control>
    </Row>
  );
};

const OverlayBookmarks = () => {
  const { overlayBookmarks } = store.settings;

  return (
    <Row>
      <Title>Show bookmarks in Overlay</Title>
      <Control>
        <Switch
          onChange={onSwitchChange('overlayBookmarks')}
          defaultValue={overlayBookmarks}
        />
      </Control>
    </Row>
  );
};

export const Appearance = () => {
  return (
    <Content>
      <Header>Appearance</Header>
      <OverlayAnimations />
      <OverlayBookmarks />
      <ThemeVariant />
    </Content>
  );
};
