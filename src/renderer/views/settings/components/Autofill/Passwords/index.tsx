import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../../store';
import { IFormFillData } from '~/interfaces';
import { Section, onMoreClick } from '../Section';
import { getUserPassword } from '~/preloads/utils/autofill';
import {
  Container,
  HeaderLabel,
  Wrapper,
  Label,
  PasswordIcon,
  More,
} from './styles';
import { ICON_KEY } from '~/renderer/constants';

const Item = observer(({ data }: { data: IFormFillData }) => {
  const { url, favicon, fields } = data;
  const [realPassword, setRealPassword] = React.useState<string>(null);

  const password = realPassword || '•'.repeat(fields.passLength);

  const onIconClick = async () => {
    const pass = !realPassword && (await getUserPassword(data));
    setRealPassword(pass);
  };

  // TODO(xnerhu): favicons

  return (
    <>
      <Wrapper>
        {/* <Icon icon={store.favicons.favicons.get(favicon)} /> */}
        <Label style={{ marginLeft: 12 }}>{url}</Label>
      </Wrapper>
      <Wrapper>
        <Label>{fields.username}</Label>
      </Wrapper>
      <Wrapper>
        <Label>{password}</Label>
        <PasswordIcon toggled={!!realPassword} onClick={onIconClick} />
        <More onClick={onMoreClick(data)} />
      </Wrapper>
    </>
  );
});

export const Passwords = observer(() => {
  return (
    <Section label="Passwords" icon={ICON_KEY}>
      <Container>
        <HeaderLabel>Website</HeaderLabel>
        <HeaderLabel>Username</HeaderLabel>
        <HeaderLabel>Password</HeaderLabel>
        {store.autoFill.credentials.map((item) => (
          <Item key={item._id} data={item} />
        ))}
      </Container>
    </Section>
  );
});
