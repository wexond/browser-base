import * as React from 'react';
import { observer } from 'mobx-react';

import store from '~/renderer/views/app/store';
import { SearchBox } from './SearchBox';
import { Dial } from './Dial';
import { TabGroups } from './TabGroups';
import { DownloadsSection } from './DownloadsSection';
import { QuickMenu } from './QuickMenu';
import { WeatherCard } from './WeatherCard';
import { Container } from '../..';
import { Scrollable, Content, Title } from '../../style';

export const Default = observer(() => {
  return (
    <Container content="default">
      <Scrollable ref={store.overlay.scrollRef}>
        <Content>
          <SearchBox />
          <Dial />

          <Title>Overview</Title>

          <TabGroups />
          {store.downloads.list.length > 0 && <DownloadsSection />}

          <QuickMenu />

          <Title>World</Title>
          <WeatherCard />
        </Content>
      </Scrollable>
    </Container>
  );
});
