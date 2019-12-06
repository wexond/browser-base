import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const EmptySection = styled.div`
  margin-top: 16px;
  padding: 8px 0px 8px 0px;
  overflow: hidden;
  border-radius: 8px;

  &:first-child {
    margin-top: 0;
  }

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['pages.lightForeground']
      ? 'rgba(255, 255, 255, 0.05)'
      : '#fafafa'};
  `};
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  padding: 16px 24px;
  font-weight: 500;
`;
