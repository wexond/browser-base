import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Section } from '../Section';
import { More } from '../Passwords/styles';
import { StyledItem } from './styles';

const Item = ({ data }: { data: IFormFillData }) => {
  return (
    <StyledItem>
      {data.fields.address}
      <More style={{ marginLeft: 'auto' }} />
    </StyledItem>
  );
}

export const Addresses = observer(() => {
  const style = {
    flexDirection: 'column',
    padding: '0px 16px 8px 16px',
  };

  return (
    <Section label='Addresses' icon={icons.location} style={style}>
      {store.autoFill.addresses.map(item => (
        <Item key={item._id} data={item} />
      ))}
    </Section>
  );
});
