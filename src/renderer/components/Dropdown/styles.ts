import styled, { css } from 'styled-components';

import {
  EASING_FUNCTION,
  transparency,
  ICON_DROPDOWN,
} from '~/renderer/constants';
import { centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledDropdown = styled.div`
  height: 32px;
  min-width: 200px;
  position: relative;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['control.backgroundColor']};

    &:hover {
      background-color: ${theme['control.hover.backgroundColor']};
    }
  `}
`;

export const Label = styled.div`
  font-size: 13px;
  margin-left: 8px;
  pointer-events: none;

  ${({ theme }: { theme: ITheme }) => css`
    color: ${theme['control.valueColor']};
  `}
`;

export const DropIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 2px;
  opacity: ${transparency.icons.inactive};
  background-image: url(${ICON_DROPDOWN});
  transition: 0.2s ${EASING_FUNCTION} transform;
  ${centerIcon(24)};

  ${({ expanded, theme }: { expanded: boolean; theme?: ITheme }) => css`
    transform: ${expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
    filter: ${theme['control.lightIcon'] ? 'invert(100%)' : 'unset'};
  `}
`;
