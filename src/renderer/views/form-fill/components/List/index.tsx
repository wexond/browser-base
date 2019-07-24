import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { IFormFillItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './styles';

const onClick = (data: IFormFillItem) => () => {
  ipcRenderer.send('form-fill-update', data._id, true);
  ipcRenderer.send('form-fill-hide');
};

const onMouseEnter = (data: IFormFillItem) => () => {
  ipcRenderer.send('form-fill-update', data._id);
};

const onMouseLeave = () => {
  ipcRenderer.send('form-fill-update');
};

const Item = observer(({ data }: { data: IFormFillItem }) => {
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
      {store.items.map(item => (
        <Item key={item._id} data={item} />
      ))}
    </StyledList>
  );
});
