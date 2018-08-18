import styled, { css } from 'styled-components';

export const Root = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  position: fixed;
  display: flex;
  transition: 0.2s opacity;
  will-change: transition;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-self: center;
  z-index: 1;
  transition: 0.2s transform;
  will-change: transform;

  ${({ visible }: { visible: boolean }) => css`
    transform: ${visible ? 'scale(1)' : 'scale(1.2)'};
  `};
`;

export const Dark = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;
