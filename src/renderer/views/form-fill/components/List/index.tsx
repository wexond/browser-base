import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { IFormFillItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './styles';

const Item = observer(({ data }: { data: IFormFillItem }) => {
  return (
    <StyledItem subtext={!!data.subtext}>
      <Text>{data.text}</Text>
      <SubText>{data.subtext}</SubText>
    </StyledItem>
  );
});

export default observer(() => {
  return (
    <StyledList>
      {store.items.map(item => (
        <Item key={item._id} data={item} />
      ))}
    </StyledList>
  );
});
