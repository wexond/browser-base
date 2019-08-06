import * as React from 'react';

import { Passwords } from './Passwords';
import { Content } from '../../../style';
import { Header } from '../style';

export const Autofill = () => {
  return (
    <Content>
      <Header style={{ paddingBottom: 12 }}>Autofill</Header>
      <Passwords />
    </Content>
  );
}

// <Item label='Addresses' icon={icons.location}></Item>
