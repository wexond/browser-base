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
} from './style';
import { ipcRenderer } from 'electron';
import { BottomSheet } from '../BottomSheet';
import { colors } from '~/renderer/constants';

const onClick = () => {
  store.overlayVisible = false;
  store.overlayExpanded = false;
  store.overlayBottom = 275;

  setTimeout(() => {
    ipcRenderer.send('browserview-show');
  }, 200);
};

const onBsClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

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

let wasUsingTrackpad = false;

@observer
export class Overlay extends React.Component {
  private bsRef: HTMLDivElement;
  private canHide: boolean = false;

  componentDidMount() {
    window.addEventListener('wheel', this.onWheel);
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.onWheel);
  }

  onWheel = (e: any) => {
    const rect = this.bsRef.getBoundingClientRect();
    if (e.deltaY > 0) {
      if (store.usingTrackpad || wasUsingTrackpad) {
        store.overlayTransition = false;

        store.overlayBottom += e.deltaY;
        wasUsingTrackpad = true;

        if (store.overlayBottom > rect.height) {
          store.overlayBottom = rect.height;
          wasUsingTrackpad = false;
        }
      } else if (!store.overlayExpanded) {
        requestAnimationFrame(() => {
          store.overlayTransition = true;
        });
        store.overlayBottom = Math.min(rect.height, window.innerHeight);
      } else {
        store.overlayBottom += e.deltaY;

        if (store.overlayBottom > rect.height) {
          store.overlayBottom = rect.height;
        }
      }

      store.overlayExpanded = true;
    } else if (e.deltaY < 0) {
      if (store.usingTrackpad || wasUsingTrackpad) {
        store.overlayTransition = false;
        wasUsingTrackpad = true;
      }

      store.overlayBottom += e.deltaY;

      if (store.overlayBottom < 275) {
        store.overlayBottom = 275;
        wasUsingTrackpad = false;

        if (store.overlayExpanded) {
          requestAnimationFrame(() => {
            store.overlayTransition = true;
          });
        } else if (wasUsingTrackpad) {
          store.overlayTransition = true;
          store.overlayVisible = false;
        }

        store.overlayExpanded = false;
      }
    }
  };

  render() {
    return (
      <StyledOverlay visible={store.overlayVisible} onClick={onClick}>
        <BottomSheet
          visible={store.overlayVisible}
          onClick={onBsClick}
          bottom={store.overlayBottom}
          transition={store.overlayTransition}
          innerRef={(r: any) => (this.bsRef = r)}
        >
          <Section>
            <Header>Tab groups</Header>
            <TabGroups />
          </Section>
          <Separator />
          <Section>
            <Header>Downloads</Header>
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
      </StyledOverlay>
    );
  }
}
