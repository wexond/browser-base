import * as React from 'react';

import { icons } from '~/renderer/constants';
import { Item } from './Item';
import { Content } from '../../../style';
import { Header } from '../style';

export const Autofill = () => {
  return (
    <Content>
      <Header style={{ paddingBottom: 12 }}>Autofill</Header>
      <Item label='Passwords' icon={icons.key}></Item>
      <Item label='Addresses' icon={icons.location}></Item>
    </Content>
  );
}
