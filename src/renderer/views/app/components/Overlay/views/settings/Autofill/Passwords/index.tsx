import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { getPassword } from 'keytar';

import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Item } from '../Item';
import { Container, HeaderLabel, Wrapper, Icon, Label, PasswordIcon, More } from './styles';

let passwords: Map<string, string> = new Map();

const getUserPassword = async (data: IFormFillData) => {
  const { url, fields } = data;
  const account = `${url}-${fields.username}`;
  const password = passwords.get(account);

  if (password) return password;

  const realPassword = await getPassword('wexond', account);

  passwords.set(account, realPassword);
  return realPassword;
}

const List = ({ data }: { data: IFormFillData }) => {
  const { url, favicon, fields } = data;
  const [ realPassword, setRealPassword ] = React.useState<string>(null);

  const password = realPassword || '•'.repeat(fields.passLength);

  const onIconClick = async () => {
    const pass = !realPassword && (await getUserPassword(data));
    setRealPassword(pass);
  }

  return <>
    <Wrapper>
      <Icon icon={store.favicons.favicons.get(favicon)} />
      <Label style={{ marginLeft: 12 }}>
        {url}
      </Label>
    </Wrapper>
    <Wrapper>
      <Label>{fields.username}</Label>
    </Wrapper>
    <Wrapper>
      <Label>{password}</Label>
      <PasswordIcon toggled={!!realPassword} onClick={onIconClick} />
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
