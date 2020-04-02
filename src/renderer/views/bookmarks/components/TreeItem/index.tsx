import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { IBookmark } from '~/interfaces';
import store from '../../store';
import { getBookmarkTitle } from '../../utils';
import { StyledTreeItem, DropIcon, FolderIcon, Label } from './style';

const onClick = (item: IBookmark) => () => {
  store.currentFolder = item._id;
};

const onDropClick = (item: IBookmark) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  e.stopPropagation();

  if (item.children.length > 0) {
    item.expanded = !item.expanded;
  }
};

const TreeItem = observer(
  ({ depth, data }: { depth: number; data: IBookmark }) => {
    if (!data) return null;

    const children = data.children || [];

    const c = children
      .map((x) => store.list.find((y) => x === y._id))
      .filter((x) => x && x.isFolder);

    return (
      <>
        <StyledTreeItem
          selected={store.currentFolder === data._id}
          onClick={onClick(data)}
          style={{ paddingLeft: depth * 30 }}
        >
          <DropIcon
            visible={c.length !== 0}
            expanded={data.expanded}
            onClick={onDropClick(data)}
          />
          <FolderIcon />
          <Label>{getBookmarkTitle(data)}</Label>
        </StyledTreeItem>
        {data.expanded &&
          c.map((item) => (
            <TreeItem key={item._id} data={item} depth={depth + 1} />
          ))}
      </>
    );
  },
);

export default TreeItem;
