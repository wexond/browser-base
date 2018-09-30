import styled, { css } from 'styled-components';

export const StyledDial = styled.div`
  padding: 0px 8px 0px 8px;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'flex' : 'none'};
  `};
`;
