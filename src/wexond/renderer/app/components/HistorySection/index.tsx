import * as React from 'react';

import HistoryItem from '../HistoryItem';
import { HistorySection } from '../../models';

import { Item, Label } from './style';

export default ({ data }: { data: HistorySection }) => {
  return (
    <Item>
      <Label>{data.label}</Label>
      {data.items.map(item => (
        <HistoryItem key={item._id} data={item} />
      ))}
    </Item>
  );
};
