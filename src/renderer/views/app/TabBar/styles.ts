import styled, { css } from 'styled-components';
import { colors } from '../../../../defaults';
import ToolbarButton from '../Toolbar/Button';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;
  will-change: opacity, transform;

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
  `};
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - 32px);
  position: relative;
  overflow: hidden;
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  top: 0;
`;

export const Indicator = styled.div`
  height: 2px;
  position: absolute;
  bottom: 0;
  background-color: ${colors.blue['500']};
`;
