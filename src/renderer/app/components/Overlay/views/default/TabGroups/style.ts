import styled, { css } from '~/renderer/app/components/Overlay/views/default/TabGroups/node_modules/styled-components';
import { icons } from '../../../app/constants';
import { centerIcon } from '~/shared/mixins';

import { Theme } from '../../../app/models/theme';

export const StyledTabGroups = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const AddTabGroup = styled.div`
  width: 42px;
  height: 42px;
  border: 1px solid black;
  opacity: 0.54;
  border-radius: 50px;
  ${centerIcon(24)};
  background-image: url(${icons.add});
  transition: 0.1s opacity;
  margin-bottom: 8px;

  &:hover {
    opacity: 1;
  }

  ${({ theme }: { theme?: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `}
`;
