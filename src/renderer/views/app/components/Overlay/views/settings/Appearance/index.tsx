import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../style';
import { Title, Row, Control, Header } from '../style';
import { onSwitchChange } from '~/renderer/views/app/utils';

const onThemeChange = (value: 'light' | 'dark') => {
  const dark = value === 'dark';

  store.settings.object.darkTheme =dark;
  store.theme = dark ? darkTheme : lightTheme;
  store.settings.save();
};

const ThemeVariant = () => {
  const defaultValue = store.settings.object.darkTheme ? 'dark' : 'light';

  return (
    <Row>
      <Title>Theme variant</Title>
      <Control>
      <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
          <Dropdown.Item value='light'>Light</Dropdown.Item>
          <Dropdown.Item value='dark'>Dark</Dropdown.Item>
        </Dropdown>
      </Control>
    </Row>
  );
};

const OverlayAnimations = () => {
  const { animations } = store.settings.object;

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
  const { overlayBookmarks } = store.settings.object;

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
