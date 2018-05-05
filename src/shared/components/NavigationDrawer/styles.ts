import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import { transparency, typography } from 'nersent-ui';
import pages from '../../defaults/pages';

export const StyledNavigationDrawer = styled.div`
  width: ${pages.navDrawerWidth}px;
  height: calc(100% - ${pages.toolbarHeight}px);
  position: fixed;
  left: 8px;
  top: ${pages.toolbarHeight}px;
  z-index: 5;
`;

export const Items = styled.div`
  margin-top: 8px;
`;

export const Item = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding-right: 16px;

  &:hover {
    background-color: #eee;
  }
`;

export const ItemIcon = styled.div`
  height: 24px;
  width: 24px;
  margin-left: 16px;
  background-color: rgba(0, 0, 0, 0.54);
  border-radius: 4px;
`;

export const ItemTitle = styled.div`
  font-size: 14px;
  ${typography.robotoMedium()};
  margin-left: 32px;
  opacity: 0.87;
`;
