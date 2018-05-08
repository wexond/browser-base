import styled from 'styled-components';
import { typography } from 'nersent-ui';
import pages from '../../defaults/pages';
import images from '../../mixins/images';

export interface StyledProps {
  fullWidth: boolean;
}

export const Styled = styled.div`
  width: ${(props: StyledProps) =>
    (props.fullWidth ? pages.navDrawerWidth.full : pages.navDrawerWidth.small)}px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #e9e9e9;
  z-index: 9999;
  transition: 0.2s ease-out width;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
  width: calc(100% - 40px - 32px);
  margin-bottom: 24px;
  margin-left: 40px;
`;

export interface TitleProps {
  fullWidth: boolean;
}

export const Title = styled.div`
  font-size: 18px;
  margin-left: 24px;
  ${typography.robotoMedium()};

  display: ${(props: TitleProps) => (props.fullWidth ? 'block' : 'none')};
`;

export const Header = styled.div`
  width: 100%;
  height: 128px;
  display: flex;
  align-items: center;
`;

export interface MenuIconProps {
  image: string;
  fullWidth: boolean;
}

export const MenuIcon = styled.div`
  cursor: pointer;
  opacity: 0.87;
  height: 20px;
  width: 20px;

  ${images.center('20px', 'auto')};

  background-image: url(${(props: MenuIconProps) => props.image});
  margin-left: ${props => (props.fullWidth ? '64px' : 'auto')};
  margin-right: ${props => (props.fullWidth ? '0px' : 'auto')};
`;
