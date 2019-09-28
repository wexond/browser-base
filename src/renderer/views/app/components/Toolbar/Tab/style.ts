import styled, { css } from 'styled-components';

import { transparency, icons } from '~/renderer/constants';
import { ITheme } from '~/interfaces';
import { centerIcon, body2 } from '~/renderer/mixins';
import { TAB_PINNED_WIDTH } from '../../../constants';

interface CloseProps {
  visible: boolean;
  theme?: ITheme;
}

export const StyledClose = styled.div`
  position: absolute;
  right: 6px;
  height: 24px;
  width: 24px;
  background-image: url('${icons.close}');
  transition: 0.1s opacity;
  z-index: 10;
  ${centerIcon(16)};

    ${({ visible, theme }: CloseProps) => css`
      opacity: ${visible ? transparency.icons.inactive : 0};
      display: ${visible ? 'block' : 'none'};
      filter: ${theme['toolbar.lightForeground'] ? 'invert(100%)' : 'none'};
    `}

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.08);
    transition: 0.2s opacity;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
  }
`;

interface TabProps {
  selected: boolean;
  visible?: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  height: 100%;
  width: 0;
  left: 0;
  align-items: center;
  will-change: width;
  -webkit-app-region: no-drag;

  ${({ selected, visible }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    display: ${visible ? 'flex' : 'none'};
  `};
`;

export const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.1s opacity;
  ${({ hovered }: { hovered: boolean }) => css`
    opacity: ${hovered ? 0.08 : 0};
  `};
`;

interface TitleProps {
  isIcon: boolean;
  selected: boolean;
  theme?: ITheme;
}

export const StyledTitle = styled.div`
  ${body2()};
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s margin-left;
  margin-left: 8px;

  ${({ isIcon, selected, theme }: TitleProps) => css`
    margin-left: ${!isIcon ? 0 : 12}px;
    color: ${selected
      ? theme['tab.selected.textColor']
      : theme['tab.textColor']};
  `};
`;

export const StyledIcon = styled.div`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s min-width;
  ${centerIcon()};
  ${({ isIconSet }: { isIconSet: boolean }) => css`
    min-width: ${isIconSet ? 0 : 16},
    opacity: ${isIconSet ? 0 : 1};
  `};
`;

interface ContentProps {
  collapsed: boolean;
  pinned: boolean;
}

export const StyledContent = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  align-items: center;
  display: flex;
  margin-left: 12px;
  ${({ collapsed, pinned }: ContentProps) => css`
    max-width: calc(100% - ${pinned ? 0 : collapsed ? 48 : 24}px);
  `};
`;

export const StyledBorder = styled.div`
  position: absolute;
  width: 1px;
  height: 16px;

  right: -1px;
  top: 50%;
  transform: translateY(-50%);

  ${({ visible, theme }: { visible: boolean; theme: ITheme }) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
    background-color: ${theme['toolbar.separator.color']};
  `};
`;

interface TabContainerProps {
  pinned: boolean;
}

export const TabContainer = styled.div`
  position: relative;
  border-radius: 6px;
  width: 100%;
  height: calc(100% - 4px);
  overflow: hidden;
  display: flex;
  align-items: center;
  backface-visibility: hidden;
  ${({ pinned }: TabContainerProps) => css`
    max-width: ${pinned ? `${TAB_PINNED_WIDTH}px` : '100%'};
  `};
`;
