import styled, { css } from 'styled-components';

export const StyledDial = styled.div`
  padding: 8px;
  flex-flow: row wrap;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'flex' : 'none'};
  `};
`;
