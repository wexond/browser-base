import styled, { css } from 'styled-components';
import { Theme } from '../../models/theme';

export const Line = styled.div`
  height: 1px;
  width: 100%;
  z-index: 2;
  position: relative;

  ${({ theme }: { theme: Theme }) => css`
    background-color: ${theme['toolbar.bottomLine.backgroundColor']};
  `}
`;

export const Screenshot = styled.div`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  flex: 1;
  position: relative;
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
