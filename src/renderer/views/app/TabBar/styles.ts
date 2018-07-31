import styled, { css } from 'styled-components';

export const StyledTabBar = styled.div`
  transform: translateZ(0);
  position: absolute;
  z-index: 8;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;
  overflow: hidden;

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
  `};
`;
