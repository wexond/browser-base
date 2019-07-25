import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { Section } from '../../../style';
import { Header, preventHiding } from '../../..';
import { Downloads } from './style';
import DownloadItem from '../DownloadSectionItem';
import store from '~/renderer/views/app/store';

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
