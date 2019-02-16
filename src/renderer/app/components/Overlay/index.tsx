import { observer } from 'mobx-react';
import * as React from 'react';
import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  StyledTabGroup,
  StyledTabGroups,
  AddTabGroup,
  HeaderArrow,
  Separator,
  Section,
  Menu,
  StyledMenuItem,
  Title,
  Icon,
  Scrollable,
  TabGroupContent,
  TabGroupClose,
} from './style';
import { BottomSheet } from '../BottomSheet';
import { colors } from '~/renderer/constants';
import { TweenLite } from 'gsap';
import { SearchBox } from '../SearchBox';

const Header = ({ children }: any) => {
  return (
    <HeaderText>
      <div style={{ display: 'inline-block' }}>{children}</div>
      <HeaderArrow />
    </HeaderText>
  );
};

const TabGroups = observer(() => {
  return (
    <StyledTabGroups>
      <TabGroup selected={false} color={colors.purple['500']} />
      <TabGroup selected={true} color={colors.lightBlue['500']} />
      <TabGroup selected={false} color={colors.orange['500']} />
      <TabGroup selected={false} color={colors.green['500']} />
      <AddTabGroup />
    </StyledTabGroups>
  );
});

const TabGroup = observer(({ selected, color }: any) => {
  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
      selected={selected}
    >
      <TabGroupContent>Tab group</TabGroupContent>
      <TabGroupClose selected={selected} />
    </StyledTabGroup>
  );
});

const MenuItem = ({ children }: any) => {
  return (
    <StyledMenuItem>
      <Icon />
      <Title>{children}</Title>
    </StyledMenuItem>
  );
};

const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
  const target = e.currentTarget;
  const bsHeight = store.overlayStore.bsRef.getBoundingClientRect().height;

  if (bsHeight <= window.innerHeight) {
    if (e.deltaY > 0) {
      if (target.scrollTop === 0) {
        TweenLite.to(target, 0.2, {
          scrollTop: bsHeight - 275,
        });
      }
    } else {
      if (target.scrollTop === target.scrollHeight - window.innerHeight) {
        TweenLite.to(target, 0.2, {
          scrollTop: 0,
        });
      }
    }
  }
};

const onClick = () => {
  store.overlayStore.visible = false;
};

const onBsClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayStore.visible} onClick={onClick}>
      <SearchBox />
      <Scrollable onWheel={onWheel} ref={store.overlayStore.scrollRef}>
        <BottomSheet
          visible={store.overlayStore.visible}
          onClick={onBsClick}
          innerRef={(r: any) => (store.overlayStore.bsRef = r)}
        >
          <Section>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Separator />
          <Section>
            <Menu>
              <MenuItem>History</MenuItem>
              <MenuItem>Bookmarks</MenuItem>
              <MenuItem>Downloads</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Extensions</MenuItem>
              <MenuItem>New window</MenuItem>
              <MenuItem>New incognito window</MenuItem>
              <MenuItem>Find</MenuItem>
              <MenuItem>More tools</MenuItem>
            </Menu>
          </Section>
        </BottomSheet>
      </Scrollable>
    </StyledOverlay>
  );
});
