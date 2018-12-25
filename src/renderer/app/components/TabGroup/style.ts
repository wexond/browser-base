import styled, { css } from 'styled-components';

export const StyledTabGroup = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  ${({ visible }: { visible: boolean }) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
    opacity: ${visible ? 1 : 0};
  `};
`;
