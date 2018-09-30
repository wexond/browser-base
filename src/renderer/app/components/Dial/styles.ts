import styled, { css } from 'styled-components';

export const StyledDial = styled.div`
  padding: 16px;
  justify-content: center;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'flex' : 'none'};
  `};
`;
