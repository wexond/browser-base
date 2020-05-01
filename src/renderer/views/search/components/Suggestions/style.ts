import styled, { css } from 'styled-components';

export const StyledSuggestions = styled.div`
  width: 100%;
  overflow: hidden;
  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'block' : 'none'};
  `};
`;
