import * as React from 'react';
import { observer } from 'mobx-react';
import { Container, Scrollable, Content, Title } from '../../style';

import store from '~/renderer/views/app/store';
import { SearchBox } from './SearchBox';
import { Dial } from './Dial';
import { TabGroups } from './TabGroups';
import { DownloadsSection } from './DownloadsSection';
import { QuickMenu } from './QuickMenu';
import { WeatherCard } from './WeatherCard';

export const Default = observer(() => {
  return (
    <Container
      visible={
        store.overlay.currentContent === 'default' && store.overlay.visible
      }
    >
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
