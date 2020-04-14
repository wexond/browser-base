import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../../store';
import { IFormFillData } from '~/interfaces';
import { Section, onMoreClick } from '../Section';
import { More } from '../Passwords/styles';
import { StyledItem } from './styles';
import { ICON_LOCATION } from '~/renderer/constants';

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
    <Section label="Addresses" icon={ICON_LOCATION} style={style}>
      {store.autoFill.addresses.map((item) => (
        <Item key={item._id} data={item} />
      ))}
    </Section>
  );
});
