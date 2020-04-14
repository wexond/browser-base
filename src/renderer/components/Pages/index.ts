import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  overflow: auto;
  height: 100vh;
  overflow: hidden;

  ${({ darken }: { darken?: boolean }) => css`
    &:after {
      opacity: ${darken ? 0.54 : 0};
      pointer-events: ${darken ? 'inherit' : 'none'};
    }
  `}

  &:after {
    content: '';
    position: fixed;
    z-index: 99;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: black;
    transition: 0.2s opacity;
  }
`;

export const Content = styled.div`
  height: 100vh;
  flex: 1;
  overflow: auto;
`;

export const LeftContent = styled.div`
  position: relative;
  margin: 64px;
  max-width: 1024px;
`;
