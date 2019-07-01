import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import { DropdownItem } from '~/renderer/components/Dropdown/styles';
import { Section, Title } from '../style';

const onThemeChange = (value: 'Light' | 'Dark') => {
  store.settings.object.isDarkTheme = value === 'Dark';
  store.theme = value === 'Dark' ? darkTheme : lightTheme;
  store.settings.save();
};

const Theme = () => {
  const defaultValue = store.settings.object.isDarkTheme ? 'Dark' : 'Light';

  return (
    <>
      <Title>Theme</Title>
      <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
        <DropdownItem>Light</DropdownItem>
        <DropdownItem>Dark</DropdownItem>
      </Dropdown>
    </>
  );
};

export const Appearance = () => {
  return (
    <Section>
      <Theme />
    </Section>
  );
};
