import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { shell } from 'electron';

import { StyledItem, Icon, Progress, Name, Info, Details } from './style';
import { IDownloadItem } from '~/interfaces';
import * as prettyBytes from 'pretty-bytes';

const onClick = (data: IDownloadItem) => () => {
  if (data.completed) {
    shell.openExternal(data.savePath);
  }
};

export default observer(({ data }: { data: IDownloadItem }) => {
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
