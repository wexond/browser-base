import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import { DropdownItem } from '~/renderer/components/Dropdown/styles';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../../style';
import { Title, Row, Control, Header } from '../style';

const onThemeChange = (value: 'Light' | 'Dark') => {
  store.settings.object.darkTheme = value === 'Dark';
  store.theme = value === 'Dark' ? darkTheme : lightTheme;
  store.settings.save();
};

const ThemeVariant = () => {
  const defaultValue = store.settings.object.darkTheme ? 'Dark' : 'Light';

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

const onAnimationsChange = (value: boolean) => {
  store.settings.object.animations = value;
  store.settings.save();
};

const OverlayAnimations = () => {
  const { animations } = store.settings.object;

  return (
    <Row>
      <Title>Overlay animations</Title>
      <Control>
        <Switch onChange={onAnimationsChange} defaultValue={animations} />
      </Control>
    </Row>
  );
};

export const Appearance = () => {
  return (
    <Content>
      <Header>Appearance</Header>
      <OverlayAnimations />
      <ThemeVariant />
    </Content>
  );
};
