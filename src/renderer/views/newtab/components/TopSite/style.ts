import styled, { css } from 'styled-components';

import { centerIcon, shadows } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';
import { ItemBase } from '../TopSites/style';

export const Item = styled(ItemBase)`
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: ${shadows(4)};
  transition: 0.2s box-shadow, 0.2s background-color;
  cursor: pointer;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    box-shadow: ${shadows(8)};
    background-color: rgba(25, 25, 25, 0.65);
  }
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
  }: {
    add?: boolean;
    icon?: string;
    custom?: boolean;
  }) => css`
    height: ${add ? 32 : 24}px;
    width: ${add ? 32 : 24}px;
    background-image: url(${add ? icons.add : icon});
    opacity: ${add || custom ? 0.54 : 1};
    filter: ${custom ? 'invert(100%)' : 'none'};
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
