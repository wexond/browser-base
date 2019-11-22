import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { StyledDownloadItem, Title, Progress } from './style';
import { IDownloadItem } from '~/interfaces';

const ITEM_WIDTH = 350 - 32 - 32;

export const DownloadItem = observer(({ item }: { item: IDownloadItem }) => {
  return (
    <StyledDownloadItem>
      <Title>{item.fileName}</Title>
      <Progress
        style={{ width: (item.receivedBytes / item.totalBytes) * ITEM_WIDTH }}
      ></Progress>
    </StyledDownloadItem>
  );
});
