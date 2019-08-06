import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { getPassword } from 'keytar';

import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Item } from '../Item';
import { Container, HeaderLabel, Wrapper, Icon, Label, PasswordIcon, More } from './styles';

const List = ({ data }: { data: IFormFillData }) => {
  const { url, fields } = data;

  return <>
    <Wrapper>
      <Icon icon='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/1024px-F_icon.svg.png' />
      <Label style={{ marginLeft: 12 }}>
        {url}
      </Label>
    </Wrapper>
    <Wrapper>
      <Label>{fields.username}</Label>
    </Wrapper>
    <Wrapper>
      <Label>rwar</Label>
      <PasswordIcon toggled={false} />
      <More />
    </Wrapper>
  </>
}

export const Passwords = observer(() => {
  return (
    <Item label='Passwords' icon={icons.key}>
      <Container>
        <HeaderLabel>Website</HeaderLabel>
        <HeaderLabel>Username</HeaderLabel>
        <HeaderLabel>Password</HeaderLabel>
        {store.autoFill.credentials.map(item => (
          <List key={item._id} data={item} />
        ))}
      </Container>
    </Item>
  );
});
