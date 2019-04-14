import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { DownloadItem } from '../../models/download-item';
import { StyledItem, Icon, Progress, Name, Info, Details } from './style';
import { execFile } from 'child_process';

const prettyBytes = require('pretty-bytes');

const onClick = (path: string) => () => {
  execFile(path);
};

export default observer(({ data }: { data: DownloadItem }) => {
  const progress = (data.receivedBytes / data.totalBytes) * 200;

  return (
    <StyledItem onClick={onClick(data.savePath)}>
      <Icon />
      <Info>
        <Name>{data.fileName}</Name>
        <Details visible={!data.completed}>
          <div>
            {prettyBytes(data.receivedBytes)}/{prettyBytes(data.totalBytes)}
          </div>
        </Details>
      </Info>
      <Progress
        style={{
          width: progress,
          display: data.completed ? 'none' : 'block',
        }}
      />
    </StyledItem>
  );
});
