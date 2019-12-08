import styled, { css } from 'styled-components';

import { centerIcon, shadows } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';
import { ItemBase } from '../TopSites/style';
import { ITheme } from '~/interfaces';

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

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['pages.lightForeground']
      ? 'rgba(0, 0, 0, 0.3)'
      : 'rgba(255, 255, 255, 0.4)'};

    &:hover {
      box-shadow: ${shadows(8)};
      background-color: ${theme['pages.lightForeground']
        ? 'rgba(0, 0, 0, 0.4)'
        : 'rgba(255, 255, 255, 0.5)'};
    }
  `};
`;

export const AddItem = styled(Item)`
  ${centerIcon(36)};
  background-image: url(${icons.add});
`;

export const Icon = styled.div`
  ${centerIcon()};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    right: -4px;
    bottom: -4px;
    opacity: 0.3;
    background-color: white;
    z-index: -1;
    border-radius: 50%;
  }

  ${({
    add,
    icon,
    custom,
    theme,
  }: {
    add?: boolean;
    icon?: string;
    custom?: boolean;
    theme?: ITheme;
  }) => css`
    height: ${add ? 32 : 24}px;
    width: ${add ? 32 : 24}px;
    background-image: url(${add ? icons.add : icon});
    opacity: ${add || custom ? 0.54 : 1};
    filter: ${custom && theme['pages.lightForeground']
      ? 'invert(100%)'
      : 'none'};
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
