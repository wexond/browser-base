import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
// import { IFormFillMenuItem } from '~/interfaces';
import { IAutoFillMenuItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './style';

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
  const onClick = React.useCallback(() => {
    console.log('test', data);
    ipcRenderer.send(`auto-fill-inject-${store.windowId}`, data._id);
    // ipcRenderer.send(`auto-fill-hide-${store.windowId}`);
  }, [data]);

  return (
    <StyledItem subtext={!!data.sublabel} onClick={onClick}>
      <Text>{data.label}</Text>
      <SubText>{data.sublabel}</SubText>
    </StyledItem>
  );
});

export default observer(() => {
  return (
    <StyledList>
      {store.data?.items.map(r => (
        <Item key={r._id} data={r} />
      ))}
    </StyledList>
  );
});
