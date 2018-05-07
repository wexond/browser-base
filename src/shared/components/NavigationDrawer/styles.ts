import styled from 'styled-components';
import { typography } from 'nersent-ui';
import pages from '../../defaults/pages';

export const StyledNavigationDrawer = styled.div`
  width: ${pages.navDrawerWidth}px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #e9e9e9;
  z-index: 9999;
`;

export const Items = styled.div`
  width: 100%;
`;

export const Item = styled.div`
  height: 48px;
  display: flex;
  position: relative;
  align-items: center;
  padding-right: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

export const ItemIcon = styled.div`
  height: 20px;
  width: 20px;
  margin-left: 64px;
  background-color: #000;
  opacity: 0.5;
  border-radius: 4px;
`;

export const ItemTitle = styled.div`
  font-size: 14px;
  ${typography.robotoRegular()};
  margin-left: 24px;
  opacity: 0.87;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.08);
  height: 1px;
  width: calc(100% - 42px - 32px);
  margin-bottom: 24px;
  margin-left: 42px;
`;

export const Indicator = styled.div`
  background-color: #2196f3;
  width: 4px;
  height: 32px;
  border-radius: 5px;
  position: absolute;
  left: 42px;
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
