import styled from 'styled-components';
import { opacity } from '../../../../defaults';
import { noUserSelect, robotoRegular } from '../../../mixins';

export interface MenuItemProps {
  visible: boolean;
  animation: boolean;
  dense: boolean;
  disabled: boolean;
}

export const StyledMenuItem = styled.div`
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;

  opacity: ${({ animation }: MenuItemProps) => (animation ? 1 : 0)};
  display: ${({ visible }) => (!visible ? 'none' : 'flex')};
  height: ${({ dense }) => (dense ? 24 : 32)}px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

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
  opacity: ${({ disabled }: TitleProps) =>
    disabled ? opacity.light.disabledText : opacity.light.primaryText};
  font-size: ${({ dense }) => (dense ? 13 : 15)}px;
`;
