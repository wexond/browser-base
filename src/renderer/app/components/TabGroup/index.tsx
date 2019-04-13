import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Icons, Icon, Input } from './style';
import { icons } from '../../constants';
import { TabGroup } from '../../models';
import store from '../../store';

const onClick = (item: TabGroup) => () => {
  if (!item.editMode) {
    store.tabGroups.currentGroupId = item.id;
  }
};

const onCloseClick = (id: number) => (e: any) => {
  e.stopPropagation();
  store.tabGroups.removeGroup(id);
};

const onEditClick = (item: TabGroup) => (e: any) => {
  e.stopPropagation();
  item.editMode = !item.editMode;
};

const onFocus = (e: any) => {
  e.currentTarget.select();
};

const onInput = (item: TabGroup) => (e: any) => {
  item.name = e.currentTarget.value;
};

const onBlur = (item: TabGroup) => () => {
  item.editMode = false;
};

const onKeyPress = (item: TabGroup) => (e: any) => {
  if (e.key === 'Enter') {
    item.editMode = false;
  }
};

export default observer(({ data }: { data: TabGroup }) => {
  const { name, color, id, editMode } = data;

  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={store.tabGroups.currentGroupId === id}
      onClick={onClick(data)}
    >
      {editMode && (
        <Input
          onBlur={onBlur(data)}
          onInput={onInput(data)}
          onKeyPress={onKeyPress(data)}
          onFocus={onFocus}
          autoFocus
          defaultValue={name}
        />
      )}
      {!editMode && <Content>{name}</Content>}
      <Icons>
        <Icon
          onClick={onEditClick(data)}
          style={{ backgroundImage: `url(${icons.edit})` }}
        />
        <Icon
          onClick={onCloseClick(id)}
          style={{ backgroundImage: `url(${icons.close})` }}
        />
      </Icons>
    </StyledTabGroup>
  );
});
