import { observer } from '~/renderer/app/components/Overlay/node_modules/mobx-react';
import * as React from '~/renderer/app/components/Overlay/node_modules/react';

import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  Scrollable,
  Title,
  Content,
  Container,
  Handle,
} from './style
import { SearchBox } from '../../../overlay/components/SearchBox';
import { TabGroups } from '../../../overlay/components/TabGroups';
import { WeatherCard } from '../../../overlay/components/WeatherCard';
import { History } from '../History';
import { Bookmarks } from '../Bookmarks';
import { Dial } from '../default/Dial';
import { QuickMenu } from './views/default/QuickMenuuickMenu
import { DownloadsSection } from '../default/DownloadsSection';
import { Settings } from '../../../overlay/components/Settings';

export const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      {children}
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (store.tabGroups.currentGroup.tabs.length > 0 && !store.overlay.isNewTab) {
    store.overlay.visible = false;
  }
  store.overlay.dialTypeMenuVisible = false;
};

export const preventHiding = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = false;
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlay.visible} onClick={onClick}>
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
      <History />
      <Bookmarks />
      <Settings />
    </StyledOverlay>
  );
});
