import styled from 'styled-components';
import typography from '../../../mixins/typography';
import userSelection from '../../../mixins/user-selection';
import opacity from '../../../defaults/opacity';

export interface MenuItemProps {
  visible: boolean;
  hide: boolean;
  dense: boolean;
}

export const StyledMenuItem = styled.div`
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;

  opacity: ${({ visible }: MenuItemProps) => (visible ? 1 : 0)};
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  height: ${({ dense }) => (dense ? 24 : 32)}px;

  &:hover {
    background-color: #eee;
  }

  &:first-child {
    margin-top: ${({ dense }) => (dense ? 4 : 8)}px;
  }

  &:last-child {
    margin-bottom: ${({ dense }) => (dense ? 4 : 8)}px;
  }
`;

export interface TitleProps {
  disabled: boolean;
  dense: boolean;
}

export const Title = styled.div`
  position: relative;
  left: 24px;

  ${typography.robotoRegular()};
  ${userSelection.noUserSelect()};
  opacity: ${({ disabled }: TitleProps) =>
    (disabled ? opacity.light.disabledText : opacity.light.primaryText)};
  font-size: ${({ dense }) => (dense ? 13 : 15)}px;
`;
