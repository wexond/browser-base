import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Icons, Icon } from './style';
import { icons } from '../../constants';

export const TabGroup = observer(({ selected, color }: any) => {
  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={selected}
    >
      <Content>Tab group</Content>
      <Icons>
        <Icon style={{ backgroundImage: `url(${icons.edit})` }} />
        <Icon style={{ backgroundImage: `url(${icons.close})` }} />
      </Icons>
    </StyledTabGroup>
  );
});
