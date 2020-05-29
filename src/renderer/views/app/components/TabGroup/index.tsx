import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { ITabGroup } from '../../models';
import { StyledTabGroup, Line, Placeholder } from './style';
import { ipcRenderer } from 'electron';
import store from '../../store';

const onPlaceholderClick = (tabGroup: ITabGroup) => () => {
  const { left, bottom } = tabGroup.ref.current.getBoundingClientRect();
  ipcRenderer.send(`show-tabgroup-dialog-${store.windowId}`, {
    name: tabGroup.name,
    id: tabGroup.id,
    x: left,
    y: bottom,
  });
};

export const TabGroup = observer(({ tabGroup }: { tabGroup: ITabGroup }) => {
  return (
    <>
      <StyledTabGroup ref={tabGroup.ref}>
        <Placeholder
          onMouseDown={onPlaceholderClick(tabGroup)}
          ref={tabGroup.placeholderRef}
          hasName={tabGroup.name !== ''}
          style={{
            backgroundColor: tabGroup.color,
          }}
        >
          {tabGroup.name}
        </Placeholder>
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
