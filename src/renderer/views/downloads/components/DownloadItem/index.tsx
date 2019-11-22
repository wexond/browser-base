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
import { shell } from 'electron';

const onClick = (item: IDownloadItem) => () => {
  if (item.completed) {
    shell.openItem(item.savePath);
  }
};

const onMoreClick = (item: IDownloadItem) => (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const DownloadItem = observer(({ item }: { item: IDownloadItem }) => {
  let received = prettyBytes(item.receivedBytes);
  const total = prettyBytes(item.totalBytes);

  const receivedSplit = received.split(' ');

  if (receivedSplit[1] === total.split(' ')[1]) {
    received = receivedSplit[0];
  }

  return (
    <StyledDownloadItem onClick={onClick(item)}>
      <Icon></Icon>
      <Info>
        <Title>{item.fileName}</Title>
        {!item.completed && (
          <>
            <ProgressBackground>
              <Progress
                style={{
                  width: `calc((${item.receivedBytes} / ${item.totalBytes}) * 100%)`,
                }}
              ></Progress>
            </ProgressBackground>
            <SecondaryText>{`${received}/${total}`}</SecondaryText>
          </>
        )}
      </Info>
      <Separator></Separator>
      <MoreButton onClick={onMoreClick(item)}></MoreButton>
    </StyledDownloadItem>
  );
});
