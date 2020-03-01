import styled, { css } from 'styled-components';
import { ContextMenuRow } from '~/renderer/components/ContextMenu';
import { IconItem } from '../App/style';
import { ITheme } from '~/interfaces';

export const SubTitle = styled(ContextMenuRow)`
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const Title = styled.div`
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const Back = styled(IconItem)`
  margin: 0 8px 0 12px;
  width: 24px;
  height: 24px;
  filter: none;

  ${({ theme }: { theme?: ITheme }) => css`
    &:after {
      filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : 'none'};
    }

    &:hover {
      background-color: ${theme['pages.lightForeground']
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)'};
      backdrop-filter: none;
    }
  `}
`;
