import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Title, Row, Control, Header, Content } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';

const onThemeChange = (value: 'light' | 'dark') => {
  const dark = value === 'dark';
  store.settings.darkTheme = dark;
  store.save();
};

const ThemeVariant = () => {
  const defaultValue = store.settings.darkTheme ? 'dark' : 'light';

  return (
    <Row>
      <Title>Theme variant</Title>
      <Control>
        <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
          <Dropdown.Item value="light">Light</Dropdown.Item>
          <Dropdown.Item value="dark">Dark</Dropdown.Item>
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
