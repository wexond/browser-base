import { ipcRenderer } from 'electron';
import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { IFormFillItem } from '~/interfaces';
import { StyledList, StyledItem, Text, SubText } from './styles';

const onMouseEnter = (data: IFormFillItem) => () => {
  ipcRenderer.send('form-fill-set', data._id);
};

const onMouseLeave = () => {
  ipcRenderer.send('form-fill-set');
};

const Item = observer(({ data }: { data: IFormFillItem }) => {
  return (
    <StyledItem
      subtext={!!data.subtext}
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
