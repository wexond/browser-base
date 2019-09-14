import styled, { css } from 'styled-components';

export const StyledSuggestions = styled.div`
  width: 100%;
  overflow: hidden;
  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'block' : 'none'};
  `};
`;

export const Subheading = styled.div`
  font-size: 12px;
  padding: 8px;
  padding-left: 16px;
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.54);
`;
