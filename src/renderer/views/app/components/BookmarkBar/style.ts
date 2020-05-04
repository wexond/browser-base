import styled, { css } from 'styled-components';
import { Button } from '../ToolbarButton/style';
import { ITheme } from '~/interfaces';

export const BookmarkBar = styled.div`
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  min-height: 32px;
  padding: 2px 8px;
  padding-top: 0px;
  padding-right: 4px;
  ${({ theme }: { theme: ITheme }) => css`
    margin-top: ${theme.isCompact ? 0 : -1}px;
    background-color: ${theme.isCompact
      ? theme['titlebar.backgroundColor']
      : theme['toolbar.backgroundColor']};
    border-bottom: 1px solid
      ${theme.isCompact
        ? 'transparent'
        : theme['toolbar.bottomLine.backgroundColor']};
    color: ${theme['addressbar.textColor']};
  `};
`;

export const BookmarkSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-flow: row;
  overflow: hidden;
`;

export const BookmarkButton = styled(Button)`
  max-width: ${({ width }: { width: number }) => width}px;
  width: auto;
  padding: 4px;
  margin: 0px 2px;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.div`
  min-width: 0px;
  max-width: 125px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px 4px 0px 0px;
`;

export const Favicon = styled.div`
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 16px;
  width: 16px;
  margin-left: 4px;
  margin-right: 4px;
`;
