import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
// import { IFormFillMenuItem } from '~/interfaces';
import { IAutoFillMenuItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './style';

// const onClick = (data: IFormFillMenuItem) => () => {
//   ipcRenderer.send(`form-fill-update-${store.windowId}`, data._id, true);
//   ipcRenderer.send(`form-fill-hide-${store.windowId}`);
// };

// const onMouseEnter = (data: IFormFillMenuItem) => () => {
//   ipcRenderer.send(`form-fill-update-${store.windowId}`, data._id);
// };

// const onMouseLeave = () => {
//   ipcRenderer.send(`form-fill-update-${store.windowId}`);
// };

/*
      onClick={onClick(data)}
      onMouseEnter={onMouseEnter(data)}
      onMouseLeave={onMouseLeave}
      */
const Item = observer(({ data }: { data: IAutoFillMenuItem }) => {
  return (
    <StyledItem subtext={!!data.sublabel}>
      <Text>{data.label}</Text>
      <SubText>{data.sublabel}</SubText>
    </StyledItem>
  );
});

export default observer(() => {
  return (
    <StyledList>
      {store.items.map((item) => (
        <Item key={item.id} data={item} />
      ))}
    </StyledList>
  );
});
