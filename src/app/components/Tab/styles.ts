import styled from 'styled-components';

// Constants and defaults
import { transparency } from 'nersent-ui';

// Mixins
import images from '../../../shared/mixins/images';

// Models
import Theme from '../../models/theme';
import Tab from '../../models/tab';

interface TabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
  hovered: boolean;
  dragging: boolean;
  theme?: Theme;
  tab: Tab;
}

interface CloseProps {
  hovered: boolean;
  theme?: Theme;
  foreground: string;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  transition: 0.2s opacity;
  z-index: 2;

  opacity: ${(props: CloseProps) => (props.hovered ? transparency.light.icons.inactive : 0)};
  ${images.center('100%', '100%')};
  filter: ${props => (props.foreground === '#000' ? '' : 'invert(100%)')};
`;

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  display: flex;
  height: 100%;
  align-items: center;
  transition: 0.2s background-color, 0.2s color;

  z-index: ${(props: TabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => (props.isRemoving || !props.visible ? 'none' : 'auto')};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  ${({
    theme, hovered, dragging, selected, tab,
  }: TabProps) => {
    const { tabs } = theme;

    let foreground = tabs.normal.foreground === 'light' ? '#fff' : '#000';
    let background = tabs.normal.background;

    if (selected) {
      foreground = `${tabs.selected.foreground === 'light' ? '#fff' : '#000'}`;
      background =
        tabs.selected.background === 'none' ? theme.toolbar.background : tabs.selected.background;

      if (hovered && !dragging && tabs.enableHoverOnSelectedTab) {
        foreground = tabs.hovered.foreground === 'light' ? '#fff' : '#000';
      }

      if (dragging && tabs.dragging.background !== 'none') {
        background = tabs.dragging.background;
        foreground = tabs.dragging.foreground === 'light' ? '#fff' : '#000';
      }
    } else if (hovered) {
      foreground = tabs.hovered.foreground === 'light' ? '#fff' : '#000';
    }

    tab.foreground = foreground;

    return `
      color: ${foreground};
      background-color: ${background};
    `;
  }};
`;

interface OverlayProps {
  theme?: Theme;
  hovered: boolean;
  selected: boolean;
}

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  transition: 0.2s opacity;

  opacity: ${(props: OverlayProps) => {
    if (props.selected) {
      if (props.hovered && props.theme.tabs.enableHoverOnSelectedTab) {
        return 1;
      }
      return 0;
    } else if (props.hovered) {
      return 1;
    }
    return 0;
  }};
  background-color: ${({ theme }: OverlayProps) => {
    const { tabs } = theme;
    if (tabs.hovered.background === 'dark') {
      return 'rgba(0, 0, 0, 0.08)';
    } else if (tabs.hovered.background === 'light') {
      return 'rgba(255, 255, 255, 0.08)';
    }
    return tabs.hovered.background;
  }};
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s opacity;
  font-weight: 500;
  margin-left: 12px;

  opacity: ${transparency.light.text.primary};
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  border: 1px dotted black;
`;

interface ContentProps {
  hovered: boolean;
  theme?: Theme;
}

export const Content = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;

  ${(props: ContentProps) => {
    if (props.theme.tabs.content.align === 'center') {
      let transform = 'transform: translateX(-50%);';
      if (props.hovered) {
        transform = 'transform: translateX(calc(-50% - 12px));';
      }
      return `
        ${transform}
        left: 50%;
      `;
    }
    return 'margin-left: 12px;';
  }}
  max-width: ${props => `calc(100% - ${24 + (props.hovered ? 24 : 0)}px)`};
`;
