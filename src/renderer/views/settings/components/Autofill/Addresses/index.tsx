import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../../store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Section, onMoreClick } from '../Section';
import { More } from '../Passwords/styles';
import { StyledItem } from './styles';

const Item = observer(({ data }: { data: IFormFillData }) => {
  return (
    <StyledItem>
      {data.fields.address}
      <More onClick={onMoreClick(data)} style={{ marginLeft: 'auto' }} />
    </StyledItem>
  );
});

export const Addresses = observer(() => {
  const style = {
    flexDirection: 'column',
    padding: '0px 16px 8px 16px',
  };

  return (
    <Section label="Addresses" icon={icons.location} style={style}>
      {store.autoFill.addresses.map(item => (
        <Item key={item._id} data={item} />
      ))}
    </Section>
  );
});
