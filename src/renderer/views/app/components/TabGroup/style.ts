import styled, { css } from 'styled-components';

export const StyledTabGroup = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const Line = styled.div`
  height: 2px;
  left: 0;
  bottom: 0;
  position: absolute;
  border-radius: 4px;
`;

export const Placeholder = styled.div`
  -webkit-app-region: no-drag;
  overflow: hidden;
  position: relative;
  transition: 0.2s width;
  color: black;
  font-size: 11px;

  ${({ hasName }: { hasName: boolean }) => css`
    padding: ${hasName ? 4 : 7}px;
    border-radius: ${hasName ? '6px' : '50%'};
  `};

  &:after {
    content: '';
    transition: 0.1s opacity;
    opacity: 0;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0%;
  }

  &:hover {
    &:after {
      opacity: 0.2;
    }
  }
`;
