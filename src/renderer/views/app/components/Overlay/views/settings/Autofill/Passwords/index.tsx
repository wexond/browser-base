import * as React from 'react';

import { Item } from '../Item';
import { icons } from '~/renderer/constants';
import { Container, HeaderLabel, Wrapper, Icon, Label, PasswordIcon, More } from './styles';

const List = () => {
  return <>
    <Wrapper>
      <Icon icon='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/1024px-F_icon.svg.png' />
      <Label style={{ marginLeft: 12 }}>
        www.facebook.com
      </Label>
    </Wrapper>
    <Wrapper>
      <Label>xnerhu@gmail.com</Label>
    </Wrapper>
    <Wrapper>
      <Label>•••••••••••</Label>
      <PasswordIcon toggled={false} />
      <More />
    </Wrapper>
  </>
}

export const Passwords = () => {
  return (
    <Item label='Passwords' icon={icons.key}>
      <Container>
        <HeaderLabel>Website</HeaderLabel>
        <HeaderLabel>Username</HeaderLabel>
        <HeaderLabel>Password</HeaderLabel>
        <List />
        <List />
      </Container>
    </Item>
  );
}
