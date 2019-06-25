import * as React from 'react';
import { observer } from 'mobx-react';

import { DownloadItem } from '../../models/download-item';
import { StyledItem, Icon, Progress, Name, Info, Details } from './style';
import { shell } from 'electron';

const prettyBytes = require('pretty-bytes');

const onClick = (data: DownloadItem) => () => {
  if (data.completed) {
    shell.openItem(data.savePath);
  }
};

export default observer(({ data }: { data: DownloadItem }) => {
  const progress = (data.receivedBytes / data.totalBytes) * 200;

  return (
    <StyledItem onClick={onClick(data)}>
      <Progress
        style={{
          width: progress,
          display: data.completed ? 'none' : 'block',
        }}
      />
      <Icon />
      <Info>
        <Name>{data.fileName}</Name>
        <Details visible={!data.completed}>
          <div>
            {prettyBytes(data.receivedBytes)}/{prettyBytes(data.totalBytes)}
          </div>
        </Details>
      </Info>
    </StyledItem>
  );
});
