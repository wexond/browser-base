import styled, { css } from 'styled-components';

import { centerIcon, shadows } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';
import { ItemBase } from '../TopSites/style';
import { ITheme } from '~/interfaces';

export const Item = styled(ItemBase)`
  box-shadow: ${shadows(4)};
  transition: 0.2s box-shadow, 0.2s background-color;
  cursor: pointer;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['pages.lightForeground']
      ? 'rgba(25, 25, 25, 0.7)'
      : 'rgba(255, 255, 255, 0.7)'};

    &:hover {
      box-shadow: ${shadows(8)};
      background-color: ${theme['pages.lightForeground']
        ? 'rgb(50, 50, 50)'
        : '#f0f0f0'};
    }
  `};
`;

export const AddItem = styled(Item)`
  ${centerIcon(36)};
  background-image: url(${icons.add});
`;

export const Icon = styled.div`
  ${centerIcon()};

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
`;
