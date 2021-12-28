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
import store from '../../store';
import { DownloadItemMenu } from '../DownloadItemMenu';

const onClick = (item: IDownloadItem) => () => {
  if (item.completed) {
    shell.openPath(item.savePath);
  }
};

const onMoreClick =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    store.openMenu(item);
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
        <Title canceled={item.canceled}>{item.fileName}</Title>
        {!item.completed && !item.canceled && (
          <>
            <ProgressBackground>
              <Progress
                style={{
                  width: `calc((${item.receivedBytes} / ${item.totalBytes}) * 100%)`,
                }}
              ></Progress>
            </ProgressBackground>
            <SecondaryText>{`${received}/${total} ${
              item.paused ? ', Paused' : ''
            }`}</SecondaryText>
          </>
        )}
        {item.canceled && <SecondaryText>Canceled</SecondaryText>}
      </Info>
      <Separator></Separator>
      <MoreButton
        toggled={item.menuIsOpen}
        onClick={onMoreClick(item)}
      ></MoreButton>
      <DownloadItemMenu item={item} visible={item.menuIsOpen} />
    </StyledDownloadItem>
  );
});
