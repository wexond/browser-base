import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Close } from './style';

export const TabGroup = observer(({ selected, color }: any) => {
  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={selected}
    >
      <Content>Tab group</Content>
      <Close selected={selected} />
    </StyledTabGroup>
  );
});
