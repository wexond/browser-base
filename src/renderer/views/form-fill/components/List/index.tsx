import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { StyledList, Item } from './styles';

export default observer(() => {
  return (
    <StyledList>
      {store.items.map(item => (
        <Item key={item._id}>{item.text}</Item>
      ))}
    </StyledList>
  );
});
