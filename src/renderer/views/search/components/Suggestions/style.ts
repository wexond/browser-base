import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const StyledSuggestions = styled.div`
  width: 100%;
  overflow: hidden;
  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    display: ${visible ? 'block' : 'none'};
    background-color: ${theme['searchBox.suggestions.backgroundColor']};
    color: ${theme['searchBox.suggestions.textColor']};
  `};
`;

export const Subheading = styled.div`
  font-size: 12px;
  padding: 8px;
  padding-left: 16px;
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.54);

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['searchBox.subHeading.backgroundColor']};
    color: ${theme['searchBox.subHeading.textColor']};
  `};
`;
