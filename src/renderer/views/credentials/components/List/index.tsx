import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../store';
import { IFormFillData } from '~/interfaces';
import { StyledItem, Username, Password, DeleteIcon } from './styles';

const onDelete = (data: IFormFillData) => () => {
  store.remove(data._id);
}

const Item = ({ data }: { data: IFormFillData }) => {
  const { username, password } = data.fields;

  return (
    <StyledItem>
      <Username>
        {username}
      </Username>
      <Password>
        {'•'.repeat(password.length)}
      </Password>
      <DeleteIcon onClick={onDelete(data)} />
    </StyledItem>
  )
}

export default observer(() => {
  return <>
    {store.list.map(data => (
      <Item key={data._id} data={data} />
    ))}
  </>;
});
