import styled from 'styled-components';
import typography from '../../../mixins/typography';
import userSelection from '../../../mixins/user-selection';
import opacity from '../../../defaults/opacity';

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
  left: 24px;
  margin-right: 24px;

  ${typography.robotoRegular()};
  ${userSelection.noUserSelect()};
  opacity: ${({ disabled }: TitleProps) =>
    (disabled ? opacity.light.disabledText : opacity.light.primaryText)};
  font-size: ${({ dense }) => (dense ? 13 : 15)}px;
`;
