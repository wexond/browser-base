import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { IFormFillData } from '~/interfaces';
import { StyledItem, Username, Password, DeleteIcon } from './styles';

const onDelete = (data: IFormFillData) => () => {
  store.remove(data);
};

const Item = ({ data }: { data: IFormFillData }) => {
  const { username, passLength } = data.fields;

  return (
    <StyledItem>
      <Username>{username}</Username>
      <Password>{'•'.repeat(passLength)}</Password>
      <DeleteIcon onClick={onDelete(data)} />
    </StyledItem>
  );
};

export default observer(() => {
  return (
    <div style={{ display: store.content === 'list' ? 'block' : 'none' }}>
      {store.list.map((data) => (
        <Item key={data._id} data={data} />
      ))}
    </div>
  );
});
