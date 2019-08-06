import * as React from 'react';

import { icons } from '~/renderer/constants';
import { Content } from '../../../style';
import { Header } from '../style';
import { StyledItem, ItemHeader, ItemLabel, DropIcon, ItemIcon } from './styles';

const Item = ({label, icon}: {label: string, icon: any}) => {
  return (
    <StyledItem>
      <ItemHeader>
        <ItemIcon icon={icon} />
        <ItemLabel>{label}</ItemLabel>
        <DropIcon />
      </ItemHeader>
    </StyledItem>
  );
}

export const Autofill = () => {
  return (
    <Content>
      <Header>Autofill</Header>
      <Item label='Passwords' icon={icons.key}></Item>
      <Item label='Addresses' icon={icons.location}></Item>
    </Content>
  );
}
