import styled, { css } from 'styled-components';

export const StyledTabGroup = styled.div`
  ${({ visible }: { visible: boolean }) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
  `};
`;
