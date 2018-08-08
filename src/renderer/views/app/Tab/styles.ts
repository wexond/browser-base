import styled, { css } from 'styled-components';

export const StyledTab = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  align-items: center;
  overflow: hidden;
  -webkit-app-region: no-drag;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'flex' : 'none'};
  `};
`;

export const Close = styled.div`
  position: absolute;
  right: 8px;
  height: 16px;
  width: 16px;
  background-color: black;
`;
