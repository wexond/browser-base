import * as React from 'react';

import { observer } from 'mobx-react';
import { Section } from '../Overlay/style';
import { Header, preventHiding } from '../Overlay';
import { Downloads } from './style';
import store from '../../store';
import DownloadItem from '../DownloadItem';

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
