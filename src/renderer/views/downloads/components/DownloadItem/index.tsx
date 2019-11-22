import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
  StyledDownloadItem,
  Title,
  Progress,
  ProgressBackground,
  Info,
  Icon,
  MoreButton,
  Separator,
  SecondaryText,
} from './style';
import { IDownloadItem } from '~/interfaces';
import prettyBytes = require('pretty-bytes');

const ITEM_WIDTH = 350 - 32 - 32;

export const DownloadItem = observer(({ item }: { item: IDownloadItem }) => {
  let received = prettyBytes(item.receivedBytes);
  const total = prettyBytes(item.totalBytes);

  const receivedSplit = received.split(' ');

  if (receivedSplit[1] === total.split(' ')[1]) {
    received = receivedSplit[0];
  }

  return (
    <StyledDownloadItem>
      <Icon></Icon>
      <Info>
        <Title>{item.fileName}</Title>
        <SecondaryText>{`${received}/${total}`}</SecondaryText>
        <ProgressBackground>
          <Progress
            style={{
              width: (item.receivedBytes / item.totalBytes) * ITEM_WIDTH,
            }}
          ></Progress>
        </ProgressBackground>
      </Info>
      <Separator></Separator>
      <MoreButton></MoreButton>
    </StyledDownloadItem>
  );
});
