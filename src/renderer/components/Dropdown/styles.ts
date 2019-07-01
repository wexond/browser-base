import styled, { css } from 'styled-components';

import { EASING_FUNCTION, transparency, icons } from '~/renderer/constants';
import { centerVertical, centerIcon, shadows } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledDropdown = styled.div`
  min-width: 112px;
  max-width: 200px;
  height: 32px;
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

export const DropIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 2px;
  opacity: ${transparency.icons.inactive};
  background-image: url(${icons.dropDown});
  transition: 0.2s ${EASING_FUNCTION} transform;
  ${centerIcon(24)};

  ${({ activated, theme }: { activated: boolean; theme: ITheme }) => css`
    transform: ${activated ? 'rotate(180deg)' : 'rotate(0deg)'};
    filter: ${theme['control.icon'] === 'dark' ? 'invert(100%)' : 'unset'};
  `}
`;

export const Menu = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  top: 100%;
  z-index: 1000;
  padding: 8px 0px;
  background-color: #fff;
  transition: 0.15s opacity, 0.15s margin-top ${EASING_FUNCTION};
  box-shadow: ${shadows(3)};

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 0 : -16}px;
  `}
`;

export const Value = styled.div`
  font-size: 14px;
  margin-left: 8px;
  color: rgba(0, 0, 0, ${transparency.text.high});

  ${({ theme }: { theme: ITheme }) => css`
    color: ${theme['control.valueColor']};
  `}
`;

export const DropdownItem = styled.div`
  width: 100%;
  height: 32px;
  padding-left: 16px;
  padding-right: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #000;
  cursor: pointer;

  ${({ selected }: { selected?: boolean }) => css`
    background-color: ${selected ? 'rgba(0, 0, 0, 0.04)' : '#fff'};
  `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
