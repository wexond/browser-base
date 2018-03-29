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

interface IScrollbarProps {
  visible: boolean;
}

export const Scrollbar = styled.div`
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;

  display: ${(props: IScrollbarProps) => (props.visible ? 'block' : 'none')};
`;

interface IScrollbarThumbProps {
  visible: boolean;
}

export const ScrollbarThumb = styled.div`
  position: absolute;
  background-color: black;
  height: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;

  opacity: ${(props: IScrollbarThumbProps) => (props.visible ? 0.2 : 0)};

  &:hover {
    opacity: 0.4;
  }

  &:active {
    opacity: 0.4;
  }
`;

interface ILineProps {
  theme: Theme;
}

export const Line = styled.div`
  height: 2px;
  width: 200px;
  bottom: 0;
  position: absolute;
  z-index: 3;

  background-color: ${props => props.theme.accentColor};
`;
