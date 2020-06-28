import styled, { css } from 'styled-components';
import { DialogStyle } from '~/renderer/mixins/dialogs';
import { centerIcon } from '~/renderer/mixins';

export const StyledMenu = styled(DialogStyle)`
  background-color: white;
  outline: transparent;

  @keyframes fadeIn {
    0% {
      transform: translate3d(0, -8px, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  animation: 0.35s ease-out 0s 1 fadeIn;
  animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
`;

export const Table = styled.table`
  padding: 4px 0px;
  border-spacing: 0;
`;

export const Container = styled.tbody`
  width: 100%;
  display: table;
  border-collapse: collapse;
`;

export interface IContextMenuItemProps {
  icon?: string;
  iconSize?: number;
  hidden?: boolean;
  disabled?: boolean;
  highlight?: boolean;
}

export const StyledItem = styled.tr`
  width: 100%;
  height: 32px;
  align-items: center;
  font-size: 13px;
  white-space: nowrap;
  display: table-row;
  ${({ disabled, highlight }: IContextMenuItemProps) => css`
    color: ${disabled ? `rgba(0, 0, 0, 0.38)` : '#000'};
    pointer-events: ${disabled ? 'none' : 'inherit'};
    background-color: ${highlight && !disabled
      ? 'rgba(0, 0, 0, 0.06)'
      : 'none'};

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  `}
`;

export const Accelerator = styled.td`
  opacity: 0.54;
  font-size: 13px;
  text-align: right;
`;

export const Icon = styled.td`
  width: 20px;
  height: 20px;
  max-width: 20px;
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  ${({ disabled, iconSize }: IContextMenuItemProps) => css`
    opacity: ${disabled ? 0.38 : 0.8};
    ${centerIcon(iconSize)};
  `}
`;

export const Text = styled.td`
  font-size: 13px;
`;

export const MenuDivider = styled.tr`
  width: 100%;
  height: 9px;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 4px;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.12);
  }
`;
