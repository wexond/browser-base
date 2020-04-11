import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { IFormFillMenuItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './styles';

const onClick = (data: IFormFillMenuItem) => () => {
  ipcRenderer.send(`form-fill-update-${store.windowId}`, data._id, true);
  ipcRenderer.send(`form-fill-hide-${store.windowId}`);
};

const onMouseEnter = (data: IFormFillMenuItem) => () => {
  ipcRenderer.send(`form-fill-update-${store.windowId}`, data._id);
};

const onMouseLeave = () => {
  ipcRenderer.send(`form-fill-update-${store.windowId}`);
};

const Item = observer(({ data }: { data: IFormFillMenuItem }) => {
  return (
    <StyledItem
      subtext={!!data.subtext}
      onClick={onClick(data)}
      onMouseEnter={onMouseEnter(data)}
      onMouseLeave={onMouseLeave}
    >
      <Text>{data.text}</Text>
      <SubText>{data.subtext}</SubText>
    </StyledItem>
  );
});

export default observer(() => {
  return (
    <StyledList>
      {store.items.map((item) => (
        <Item key={item._id} data={item} />
      ))}
    </StyledList>
  );
});
