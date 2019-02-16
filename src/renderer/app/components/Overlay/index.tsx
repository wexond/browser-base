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
  SelectedIndicator,
  Separator,
  Section,
  Menu,
  StyledMenuItem,
  Title,
  Icon,
  Scrollable,
  SearchBox,
  Input,
  SearchIcon,
  InputContainer,
} from './style';
import { BottomSheet } from '../BottomSheet';
import { colors } from '~/renderer/constants';
import { TweenLite } from 'gsap';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';
import { isURL } from '~/shared/utils/url';

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
      <TabGroup selected={true} color={colors.lightBlue['500']} />
      <TabGroup selected={false} color={colors.orange['500']} />
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
    >
      Tab group
      <SelectedIndicator visible={selected} />
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

@observer
export class Overlay extends React.Component {
  onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
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

  onClick = () => {
    store.overlayStore.visible = false;
  };

  onBsClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  onSearchClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      // Enter.
      const tab = store.tabsStore.selectedTab;

      e.preventDefault();

      const text = e.currentTarget.value;
      let url = text;

      if (isURL(text) && !text.includes('://')) {
        url = `http://${text}`;
      } else if (!text.includes('://')) {
        url = `https://www.google.com/search?q=${text}`;
      }

      store.overlayStore.inputRef.current.value = url;
      tab.url = url;
      callBrowserViewMethod(tab.id, 'loadURL', url);

      store.overlayStore.visible = false;
    }
  };

  render() {
    return (
      <StyledOverlay
        visible={store.overlayStore.visible}
        onClick={this.onClick}
      >
        <SearchBox onClick={this.onSearchClick}>
          <InputContainer>
            <SearchIcon />
            <Input
              placeholder="Search or type in URL"
              onKeyPress={this.onKeyPress}
              ref={store.overlayStore.inputRef}
            />
          </InputContainer>
        </SearchBox>
        <Scrollable onWheel={this.onWheel} ref={store.overlayStore.scrollRef}>
          <BottomSheet
            visible={store.overlayStore.visible}
            onClick={this.onBsClick}
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
  }
}
