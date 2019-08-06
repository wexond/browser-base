import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Item } from '../Item';
import { More } from '../Passwords/styles';
import { StyledList } from './styles';

const List = ({ data }: { data: IFormFillData }) => {
  return (
    <StyledList>
      {data.fields.address}
      <More style={{ marginLeft: 'auto' }} />
    </StyledList>
  );
}

export const Addresses = observer(() => {
  const style = {
    flexDirection: 'column',
    padding: '0px 16px 8px 16px',
  };

  return (
    <Item label='Addresses' icon={icons.location} style={style}>
      {store.autoFill.addresses.map(item => (
        <List key={item._id} data={item} />
      ))}
    </Item>
  );
});
