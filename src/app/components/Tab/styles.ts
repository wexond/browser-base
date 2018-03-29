import styled from 'styled-components';

// Constants and defaults
import { transparency } from 'nersent-ui';

// Mixins
import images from '../../../shared/mixins/images';

// Models
import Theme from '../../models/theme';

interface TabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
  hovered: boolean;
  dragging: boolean;
  theme?: Theme;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  display: flex;
  height: 100%;
  align-items: center;
  transition: 0.2s background-color;

  z-index: ${(props: TabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => (props.isRemoving || !props.visible ? 'none' : 'auto')};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  background-color: ${({
    theme, hovered, dragging, selected,
  }: TabProps) => {
    const { backgrounds } = theme.tabs;

    if (hovered && !dragging) {
      if (backgrounds.hover === 'dark') {
        return 'rgba(0, 0, 0, 0.08)';
      } else if (backgrounds.hover === 'light') {
        return 'rgba(255, 255, 255, 0.08)';
      }
      return backgrounds.hover;
    } else if (dragging || selected) {
      return backgrounds.selected === 'none' ? theme.toolbar.background : backgrounds.selected;
    }
    return backgrounds.normal;
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

interface CloseProps {
  hovered: boolean;
  theme?: Theme;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  transition: 0.2s opacity;

  opacity: ${(props: CloseProps) => (props.hovered ? transparency.light.icons.inactive : 0)};
  filter: ${props => props.theme.toolbar.foreground === 'light' && 'invert(100%)'};
  ${images.center('100%', '100%')};
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
  left: 50%;
  overflow: hidden;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;

  transform: ${(props: ContentProps) =>
    (props.hovered ? 'translateX(calc(-50% - 12px))' : 'translateX(-50%)')};
  max-width: ${props => `calc(100% - ${24 + (props.hovered ? 24 : 0)}px)`};
`;
