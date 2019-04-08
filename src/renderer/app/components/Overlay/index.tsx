import { observer } from 'mobx-react';
import * as React from 'react';

import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  HeaderArrow,
  Section,
  Menu,
  Scrollable,
  Title,
  Content,
  DropArrow,
} from './style';
import { SearchBox } from '../SearchBox';
import { MenuItem } from '../MenuItem';
import { TabGroups } from '../TabGroups';
import { icons } from '../../constants';

const Header = ({ children, clickable }: any) => {
  return (
    <HeaderText clickable={clickable}>
      <div style={{ display: 'inline-block' }}>{children}</div>
      {clickable && <HeaderArrow />}
    </HeaderText>
  );
};

const onClick = () => {
  if (store.tabGroupsStore.currentGroup.tabs.length > 0) {
    store.overlayStore.visible = false;
  }
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayStore.visible} onClick={onClick}>
      <Scrollable ref={store.overlayStore.scrollRef}>
        <Content>
          <SearchBox />
          <Title>
            <div style={{ display: 'inline-block' }}>Top Sites</div>
            <DropArrow />
          </Title>
          <Menu>
            {store.historyStore.topSites.map(item => (
              <MenuItem maxLines={1} light icon={item.favicon}>
                {item.title}
              </MenuItem>
            ))}
          </Menu>
          <Title>Overview</Title>
          <Section onClick={preventHiding}>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Section onClick={preventHiding}>
            <Header>Menu</Header>
            <Menu>
              <MenuItem invert icon={icons.history}>
                History
              </MenuItem>
              <MenuItem invert icon={icons.bookmarks}>
                Bookmarks
              </MenuItem>
              <MenuItem invert icon={icons.download}>
                Downloads
              </MenuItem>
              <MenuItem invert icon={icons.settings}>
                Settings
              </MenuItem>
              <MenuItem invert icon={icons.extensions}>
                Extensions
              </MenuItem>
              <MenuItem invert icon={icons.window}>
                New window
              </MenuItem>
              <MenuItem invert icon={icons.window}>
                New incognito window
              </MenuItem>
              <MenuItem invert icon={icons.find}>
                Find
              </MenuItem>
              <MenuItem invert icon={icons.more}>
                More tools
              </MenuItem>
            </Menu>
          </Section>
        </Content>
      </Scrollable>
    </StyledOverlay>
  );
});
