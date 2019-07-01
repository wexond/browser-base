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

const Theme = () => {
  const defaultValue = store.settings.object.darkTheme ? 'Dark' : 'Light';

  return (
    <Row>
      <Title>Theme</Title>
      <Control>
        <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
          <DropdownItem>Light</DropdownItem>
          <DropdownItem>Dark</DropdownItem>
        </Dropdown>
      </Control>
    </Row>
  );
};

const onAnimationsChange = (value: boolean) => {
  store.settings.object.animationsToggled = value;
  store.settings.save();
};

const OverlayAnimations = () => {
  const { animationsToggled } = store.settings.object;

  return (
    <Row>
      <Title>Overlay animations</Title>
      <Control>
        <Switch
          onChange={onAnimationsChange}
          defaultValue={animationsToggled}
        />
      </Control>
    </Row>
  );
};

const OverlayBlur = () => {
  return (
    <Row>
      <Title>Overlay blur</Title>
      <Control>
        <Switch />
      </Control>
    </Row>
  );
};

export const Appearance = () => {
  return (
    <Content>
      <Header>Appearance</Header>
      <OverlayBlur />
      <OverlayAnimations />
      <Theme />
    </Content>
  );
};
