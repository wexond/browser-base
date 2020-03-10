import styled, { css } from 'styled-components';

import { centerIcon, shadows } from '~/renderer/mixins';
import { ItemBase } from '../TopSites/style';
import { ITheme } from '~/interfaces';
import { ICON_ADD } from '~/renderer/constants';

const getBgColor = (imageSet: boolean, dark: boolean, hover: boolean) => {
  if (imageSet) {
    if (!dark) {
      return `rgba(255, 255, 255, ${hover ? 0.5 : 0.4})`;
    } else {
      return `rgba(0, 0, 0, ${hover ? 0.4 : 0.3})`;
    }
  } else {
    if (dark) {
      return `rgba(255, 255, 255, ${hover ? 0.3 : 0.2})`;
    } else {
      return `rgba(0, 0, 0, ${hover ? 0.2 : 0.1})`;
    }
  }
};

export const Item = styled(ItemBase)`
  transition: 0.2s box-shadow, 0.2s background-color;
  cursor: pointer;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;

  ${({ theme, imageSet }: { theme?: ITheme; imageSet: boolean }) => css`
    background-color: ${getBgColor(
      imageSet,
      theme['pages.lightForeground'],
      false,
    )};

    &:hover {
      box-shadow: ${shadows(8)};
      background-color: ${getBgColor(
        imageSet,
        theme['pages.lightForeground'],
        true,
      )};
    }
  `};
`;

export const AddItem = styled(Item)`
  ${centerIcon(36)};
  background-image: url(${ICON_ADD});
`;

export const Icon = styled.div`
  ${centerIcon()};
  position: relative;

  ${({
    add,
    icon,
    custom,
    theme,
    imageSet,
  }: {
    add?: boolean;
    icon?: string;
    custom?: boolean;
    theme?: ITheme;
    imageSet: boolean;
  }) => css`
    height: ${add ? 32 : 24}px;
    width: ${add ? 32 : 24}px;
    background-image: url(${add ? ICON_ADD : icon});
    opacity: ${add || custom ? 0.54 : 1};
    filter: ${theme['pages.lightForeground'] && custom
      ? 'invert(100%)'
      : 'none'};

    &:before {
      content: '';
      position: absolute;
      left: -6px;
      top: -6px;
      right: -6px;
      bottom: -6px;
      opacity: 0.3;
      background-color: ${add ? 'transparent' : 'white'};
      z-index: -1;
      border-radius: 50%;
    }

    &:before {
      left: ${add ? -4 : -6}px;
      top: ${add ? -4 : -6}px;
      right: ${add ? -4 : -6}px;
      bottom: ${add ? -4 : -6}px;
    }
  `}
`;

export const Title = styled.div`
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  max-width: calc(100% - 16px);
  margin-top: 20px;
  margin-bottom: -8px;
  opacity: 0.87;
`;
