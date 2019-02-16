import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledTabGroups, AddTabGroup } from './style';
import { colors } from '~/renderer/constants';
import { TabGroup } from '../TabGroup';

export const TabGroups = observer(() => {
  return (
    <StyledTabGroups>
      <TabGroup selected={false} color={colors.purple['500']} />
      <TabGroup selected={true} color={colors.lightBlue['500']} />
      <TabGroup selected={false} color={colors.orange['500']} />
      <TabGroup selected={false} color={colors.green['500']} />
      <AddTabGroup />
    </StyledTabGroups>
  );
});
