import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { IBookmark } from '~/interfaces';
import store from '../../store';
import { getBookmarkTitle } from '../../utils';
import { StyledTreeItem, DropIcon, FolderIcon, Label } from './style';

const onClick = (item: IBookmark) => () => {
  store.currentFolder = item._id;
};

const onDropClick = (item: IBookmark) => (e: React.MouseEvent) => {
  e.stopPropagation();

  if (item.children.length) {
    item.expanded = !item.expanded;
  }
};

const TreeItem = observer(
  ({ depth, data }: { depth: number; data: IBookmark }) => {
    if (!data) return null;

    const children = data.children || [];

    return (
      <>
        <StyledTreeItem
          onClick={onClick(data)}
          style={{ paddingLeft: depth * 30 }}
        >
          <DropIcon
            visible={children.length !== 0}
            expanded={data.expanded}
            onClick={onDropClick(data)}
          />
          <FolderIcon />
          <Label>{getBookmarkTitle(data)}</Label>
        </StyledTreeItem>
        {data.expanded &&
          children.map(id => (
            <TreeItem
              key={id}
              data={store.folders.find(r => r._id === id)}
              depth={depth + 1}
            />
          ))}
      </>
    );
  },
);

export default TreeItem;
