import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { ITabGroup } from '../../../models';
import { StyledTabGroup, Line, Placeholder } from './style';

export const TabGroup = observer(({ tabGroup }: { tabGroup: ITabGroup }) => {
  return (
    <>
      <StyledTabGroup ref={tabGroup.ref}>
        <Placeholder
          ref={tabGroup.placeholderRef}
          style={{
            backgroundColor: tabGroup.color,
          }}
        ></Placeholder>
        <Line
          ref={tabGroup.lineRef}
          style={{
            backgroundColor: tabGroup.color,
          }}
        />
      </StyledTabGroup>
    </>
  );
});
