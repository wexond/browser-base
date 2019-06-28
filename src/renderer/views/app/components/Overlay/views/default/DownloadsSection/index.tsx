import * as React from 'react';

import { observer } from 'mobx-react';
import { Section } from '../../../style';
import { Header, preventHiding } from '../../..';
import { Downloads } from './style';
import store from '../../../app/store';
import DownloadItem from '../DownloadSectionItem';

export const DownloadsSection = observer(() => {
  return (
    <Section onClick={preventHiding}>
      <Header>Downloads</Header>
      <Downloads>
        {store.downloads.list.map(item => (
          <DownloadItem data={item} key={item.id} />
        ))}
      </Downloads>
    </Section>
  );
});
