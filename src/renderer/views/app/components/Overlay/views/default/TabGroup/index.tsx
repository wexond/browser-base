import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledTabGroup, Content, Icons, Icon, Input } from './style';
import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/constants';
import { ITabGroup } from '~/renderer/views/app/models';

const onClick = (item: ITabGroup) => () => {
  if (!item.editMode) {
    store.tabGroups.currentGroupId = item.id;
  }
};

const onCloseClick = (id: number) => (e: any) => {
  e.stopPropagation();
  store.tabGroups.removeGroup(id);
};

const onEditClick = (item: ITabGroup) => (e: any) => {
  e.stopPropagation();
  item.editMode = !item.editMode;
};

const onFocus = (e: any) => {
  e.currentTarget.select();
};

const onInput = (item: ITabGroup) => (e: any) => {
  item.name = e.currentTarget.value;
};

const onBlur = (item: ITabGroup) => () => {
  item.editMode = false;
};

const onKeyPress = (item: ITabGroup) => (e: any) => {
  if (e.key === 'Enter') {
    item.editMode = false;
  }
};

export const TabGroup = observer(({ data }: { data: ITabGroup }) => {
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
