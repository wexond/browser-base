import styled, { css } from 'styled-components';

import { centerIcon } from '~/renderer/mixins';
import { transparency } from '~/renderer/constants';
import { ICON_FOLDER, ICON_DROPDOWN } from '~/renderer/constants/icons';
import { ITheme } from '~/interfaces';

export const StyledTreeItem = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  margin-top: 4px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;

  ${({ theme, selected }: { theme?: ITheme; selected: boolean }) => css`
    &:hover {
      background-color: ${theme['pages.lightForeground']
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.04)'};
    }

    background-color: ${selected
      ? theme['pages.lightForeground']
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.06)'
      : 'none'};
  `}
`;

export const DropIcon = styled.div`
  min-width: 24px;
  min-height: 24px;
  margin: 0px 2px;
  background-image: url(${ICON_DROPDOWN});
  border-radius: 100%;
  ${centerIcon(20)};
  ${({
    visible,
    expanded,
    theme,
  }: {
    visible: boolean;
    expanded: boolean;
    theme?: ITheme;
  }) => css`
    opacity: ${visible ? transparency.icons.inactive : 0};
    transform: ${expanded ? 'rotate(-90deg)' : 'rotate(0deg)'};
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : ''};

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      opacity: ${visible ? 1 : 0};
    }
  `}
`;

export const FolderIcon = styled.div`
  min-width: 24px;
  min-height: 24px;
  opacity: ${transparency.icons.inactive};
  background-image: url(${ICON_FOLDER});
  ${centerIcon(20)}

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['pages.lightForeground'] ? 'invert(100%)' : ''};
  `}
`;

export const Label = styled.div`
  font-size: 13px;
  margin-left: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
