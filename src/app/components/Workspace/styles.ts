import styled, { css } from 'styled-components';
import { TOOLBAR_BUTTON_WIDTH } from '../../constants';
import colors from '../../../shared/defaults/colors';
import ToolbarButton from '../Toolbar/Button';

export const Root = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  will-change: transition, transform, opacity;
  transition: 0.3s transform, 0.2s opacity;

  ${({ visible, hiding }: { visible: boolean; hiding: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    transform: ${visible ? 'scale(1)' : 'scale(0.8)'};
  `};
`;

export const Tabs = styled.div`
  width: 100%;
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  overflow: hidden;
  position: relative;
`;

interface ScrollbarProps {
  visible: boolean;
}

export const Scrollbar = styled.div`
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;

  display: ${({ visible }: ScrollbarProps) => (visible ? 'block' : 'none')};
`;

interface ScrollbarThumbProps {
  visible: boolean;
}

export const ScrollbarThumb = styled.div`
  position: absolute;
  background-color: black;
  height: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;

  opacity: ${({ visible }: ScrollbarThumbProps) => (visible ? 0.2 : 0)};

  &:hover {
    opacity: 0.4;
  }

  &:active {
    opacity: 0.4;
  }
`;

export const Indicator = styled.div`
  height: 2px;
  width: 200px;
  bottom: 0;
  position: absolute;
  z-index: 3;
  border-radius: 5px;
  background-color: ${colors.blue['500']};
`;

export const AddTabButton = styled(ToolbarButton)`
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
`;
