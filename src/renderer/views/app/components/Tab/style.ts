import styled, { css } from 'styled-components';

import { transparency, ICON_CLOSE } from '~/renderer/constants';
import { ITheme } from '~/interfaces';
import { centerIcon } from '~/renderer/mixins';
import { TAB_PINNED_WIDTH } from '../../constants';
import { TAB_HEIGHT, TAB_MARGIN_TOP } from '~/constants/design';

interface CloseProps {
  visible: boolean;
  theme?: ITheme;
}

export const StyledClose = styled.div`
  height: 20px;
  width: 20px;
  margin-left: 2px;
  margin-right: 6px;
  background-image: url('${ICON_CLOSE}');
  transition: 0.1s background-color;
  z-index: 10;
  ${centerIcon(16)};

    ${({ visible, theme }: CloseProps) => css`
      opacity: ${visible ? transparency.icons.inactive : 0};
      display: ${visible ? 'block' : 'none'};
      filter: ${theme['toolbar.lightForeground'] ? 'invert(100%)' : 'none'};
    `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

interface TabProps {
  selected: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  height: 100%;
  width: 0;
  left: 0;
  will-change: width, transform;
  -webkit-app-region: no-drag;
  display: flex;
  backface-visibility: hidden;

  ${({ selected }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
  `};
`;

interface TitleProps {
  isIcon: boolean;
  selected: boolean;
  theme?: ITheme;
}

export const StyledTitle = styled.div`
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s margin-left;
  margin-left: 8px;
  min-width: 0;
  flex: 1;

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

export const StyledContent = styled.div`
  overflow: hidden;
  z-index: 2;
  align-items: center;
  display: flex;
  margin-left: 10px;
  flex: 1;
`;

interface TabContainerProps {
  pinned: boolean;
}

export const TabContainer = styled.div`
  position: relative;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  width: 100%;
  height: ${TAB_HEIGHT}px;
  margin-top: ${TAB_MARGIN_TOP}px;
  align-items: center;
  overflow: hidden;
  display: flex;
  backface-visibility: hidden;
  transition: 0.1s background-color;

  ${({ pinned }: TabContainerProps) => css`
    max-width: ${pinned ? `${TAB_PINNED_WIDTH}px` : '100%'};
  `};
`;
