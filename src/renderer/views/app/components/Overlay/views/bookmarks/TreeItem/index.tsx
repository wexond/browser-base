import * as React from 'react';
import { observer } from 'mobx-react';
import { StyledTreeItem, DropIcon, FolderIcon, Label } from './styles';

const onClick = (item: any) => () => {
  // store.pages.current.location.path = item.path;
};

const onDropClick = (item: any) => (e: React.MouseEvent) => {
  e.stopPropagation();

  /*if (item.children.length) {
    item.selected = !item.selected;
  }*/
};

const TreeItem = observer(
  ({ depth, data }: { depth?: number; data: any /*TreeItem*/ }) => {
    depth = depth || 0;

    return (
      <React.Fragment>
        <StyledTreeItem
          onClick={onClick(data)}
          style={{ paddingLeft: depth * 30 }}
        >
          <DropIcon
            visible={data.children.length !== 0}
            selected={data.selected}
            onClick={onDropClick(data)}
          />
          <FolderIcon />
          <Label>{data.name}</Label>
        </StyledTreeItem>
        {data.selected &&
          data.children.map((item: any) => (
            <TreeItem key={item._id} data={item} depth={depth + 1} />
          ))}
      </React.Fragment>
    );
  },
);

export default TreeItem;
