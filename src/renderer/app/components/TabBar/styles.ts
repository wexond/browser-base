import styled, { css } from 'styled-components';

import { TOOLBAR_BUTTON_WIDTH } from '@/constants/app';
import ToolbarButton from '../ToolbarButton';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: 0.3s opacity, 0.3s transform;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    transform: ${visible ? '' : 'translateY(30px)'};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  position: relative;
  overflow: hidden;
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  top: 0;
`;
