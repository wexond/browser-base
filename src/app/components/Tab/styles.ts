import { transparency } from 'nersent-ui';
import styled from 'styled-components';
import images from '../../../shared/mixins/images';
import { TabTheme, Theme } from '../../models/theme';

const closeIcon = require('../../../shared/icons/actions/close.svg');

interface CloseProps {
  hovered: boolean;
  tabState: TabTheme;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(${closeIcon});
  transition: 0.2s opacity, 0.2s filter;
  z-index: 2;

  ${images.center('100%', '100%')};
  opacity: ${(props: CloseProps) => (props.hovered ? transparency.light.icons.inactive : 0)};
  filter: ${props => (props.tabState.close.color === 'light' ? 'invert(100%)' : '')};
`;

interface TabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  display: flex;
  height: 100%;
  align-items: center;
  transition: 0.2s background-color, 0.1s color;

  z-index: ${(props: TabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => (props.isRemoving || !props.visible ? 'none' : 'auto')};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  background-color: 'none';
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
  background-color: ${(props: OverlayProps) => props.theme.tabs.hovered.background};
`;

interface TitleProps {
  favicon: string;
}

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s all;
  font-weight: 500;
  margin-left: 12px;

  opacity: ${transparency.light.text.primary};
  margin-left: ${(props: TitleProps) => (props.favicon === '' ? 0 : '12px')};
`;

interface IconProps {
  favicon: string;
  styleToApply: any;
}

export const Icon = styled.div.attrs({
  style: (props: any) => ({
    ...props.styleToApply,
    backgroundImage: `url(${props.favicon})`,
    opacity: props.favicon === '' ? 0 : 1,
    minWidth: props.favicon === '' ? 0 : 16,
  }),
})`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s width;
  ${images.center('16px', '16px')};
  ${(props: IconProps) => props.favicon};
`;

interface ContentProps {
  hovered: boolean;
  tabState: TabTheme;
}

export const Content = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;

  ${(props: ContentProps) => {
    if (props.tabState.content.align === 'center') {
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
