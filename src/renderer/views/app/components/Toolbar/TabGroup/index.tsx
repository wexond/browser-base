import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { ITabGroup } from '../../../models';
import { StyledTabGroup } from './style';

export const TabGroup = observer(({ tabGroup }: { tabGroup: ITabGroup }) => {
  return (
    <StyledTabGroup
      ref={tabGroup.ref}
      style={{
        backgroundColor: tabGroup.color,
      }}
    ></StyledTabGroup>
  );
});
