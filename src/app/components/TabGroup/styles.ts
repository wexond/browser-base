import styled from 'styled-components';

// Constants and defaults
import { TOOLBAR_BUTTON_WIDTH } from '../../constants/design';

// Models
import Theme from '../../models/theme';

export const Tabs = styled.div`
  transform: translateZ(0);
  position: relative;
  height: 100%;
  overflow: hidden;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
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

  display: ${(props: ScrollbarProps) => (props.visible ? 'block' : 'none')};
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

  opacity: ${(props: ScrollbarThumbProps) => (props.visible ? 0.2 : 0)};

  &:hover {
    opacity: 0.4;
  }

  &:active {
    opacity: 0.4;
  }
`;

interface LineProps {
  theme?: Theme;
}

export const Line = styled.div`
  height: 2px;
  width: 200px;
  bottom: 0;
  position: absolute;
  z-index: 3;

  background-color: ${(props: LineProps) => props.theme.accentColor};
`;
