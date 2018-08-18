import styled, { css } from 'styled-components';
import { robotoRegular, noUserSelect } from '@mixins';
import { transparency } from '~/defaults';

export interface MenuItemProps {
  visible: boolean;
  dense: boolean;
  disabled: boolean;
}

export const StyledMenuItem = styled.div`
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;

  ${({ visible, dense, disabled }: MenuItemProps) => css`
    display: ${!visible ? 'none' : 'flex'};
    height: ${dense ? 24 : 32}px;
    pointer-events: ${disabled ? 'none' : 'auto'};
  `};

  &:hover {
    background-color: #eee;
  }
`;

export interface TitleProps {
  disabled: boolean;
  dense: boolean;
}

export const Title = styled.div`
  position: relative;
  left: 16px;
  margin-right: 16px;
  ${robotoRegular()};
  ${noUserSelect()};

  ${({ disabled, dense }: TitleProps) => css`
    opacity: ${disabled
      ? transparency.light.disabledText
      : transparency.light.primaryText};
    font-size: ${dense ? 13 : 15}px;
  `};
`;
