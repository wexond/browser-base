import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import { DropdownItem } from '~/renderer/components/Dropdown/styles';
import { Section, Title } from '../style';

export const Appearance = () => {
  return (
    <Section>
      <Title>Appearance</Title>
      <Dropdown defaultValue="light">
        <DropdownItem>Light</DropdownItem>
        <DropdownItem>Dark</DropdownItem>
      </Dropdown>
    </Section>
  );
};
