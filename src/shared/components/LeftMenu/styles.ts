import styled from 'styled-components';
import { typography } from 'nersent-ui';
import pages from '../../defaults/pages';
import images from '../../mixins/images';

export const Styled = styled.div`
  width: ${pages.navDrawerWidth}px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #e9e9e9;
  z-index: 9999;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
  width: calc(100% - 40px - 32px);
  margin-bottom: 24px;
  margin-left: 40px;
`;

export const Title = styled.div`
  font-size: 18px;
  ${typography.robotoMedium()};
  margin-left: 24px;
`;

export const Header = styled.div`
  height: 128px;
  display: flex;
  align-items: center;
`;

export interface MenuIconProps {
  image: string;
}

export const MenuIcon = styled.div`
  cursor: pointer;
  margin-left: 64px;
  background-image: url(${(props: MenuIconProps) => props.image});
  ${images.center('20px', 'auto')};
  opacity: 0.87;
  height: 20px;
  width: 20px;
`;
