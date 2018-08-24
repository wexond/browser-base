import styled, { css } from 'styled-components';
import { robotoRegular, noUserSelect } from '@mixins';
import { transparency } from '~/renderer/defaults';

export interface MenuItemProps {
  visible: boolean;
  disabled: boolean;
}

export const StyledMenuItem = styled.div`
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;

  ${({ visible, disabled }: MenuItemProps) => css`
    display: ${!visible ? 'none' : 'flex'};
    height: 32px;
    pointer-events: ${disabled ? 'none' : 'auto'};
  `};

  &:hover {
    background-color: #eee;
  }
`;

export interface TitleProps {
  disabled: boolean;
}

export const Title = styled.div`
  position: relative;
  left: 24px;
  margin-right: 24px;
  font-size: 13px;
  ${robotoRegular()};
  ${noUserSelect()};

  ${({ disabled }: TitleProps) => css`
    opacity: ${disabled
      ? transparency.light.disabledText
      : transparency.light.primaryText};
  `};
`;
