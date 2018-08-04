import styled, { css } from 'styled-components';

import ToolbarButton from '../Toolbar/Button';
import { TOOLBAR_BUTTON_WIDTH } from '../../../../constants';
import { colors } from '../../../../defaults';

export const Root = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  will-change: transition, margin-left, opacity;
  transition: 0.3s margin-left, 0.35s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    margin-left: ${visible ? '0' : '-50px'};
    z-index: ${visible ? 1 : -1};
  `};
`;

export const Tabs = styled.div`
  width: 100%;
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  overflow: hidden;
  position: relative;
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
