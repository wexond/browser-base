import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import { DropdownItem } from '~/renderer/components/Dropdown/styles';
import Switch from '~/renderer/components/Switch';
import { Section, Title, Row, Control } from '../style';

const onThemeChange = (value: 'Light' | 'Dark') => {
  store.settings.object.isDarkTheme = value === 'Dark';
  store.theme = value === 'Dark' ? darkTheme : lightTheme;
  store.settings.save();
};

const Theme = () => {
  const defaultValue = store.settings.object.isDarkTheme ? 'Dark' : 'Light';

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
  store.settings.object.areAnimationsToggled = value;
  store.settings.save();
};

const OverlayAnimations = () => {
  const { areAnimationsToggled } = store.settings.object;

  return (
    <Row>
      <Title>Overlay animations</Title>
      <Control>
        <Switch
          onChange={onAnimationsChange}
          defaultValue={areAnimationsToggled}
        />
      </Control>
    </Row>
  );
};

const FontSize = () => {
  return (
    <Row>
      <Title>Font size</Title>
      <Control>
        <Dropdown defaultValue="Medium (Recommended)" onChange={onThemeChange}>
          <DropdownItem>Very small</DropdownItem>
          <DropdownItem>Small</DropdownItem>
          <DropdownItem>Medium (Recommended)</DropdownItem>
          <DropdownItem>Large</DropdownItem>
          <DropdownItem>Very large</DropdownItem>
        </Dropdown>
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
    <Section>
      <Theme />
      <OverlayAnimations />
      <FontSize />
      <OverlayBlur />
    </Section>
  );
};
