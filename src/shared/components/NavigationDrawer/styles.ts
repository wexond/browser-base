import styled from 'styled-components';

import { transparency, icons } from '@/constants/renderer';
import { h6, body2, centerImage } from '@/mixins';

export const Root = styled.div`
  height: 100%;
  width: 256px;
  background-color: #fff;
  position: fixed;
  flex-flow: column;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
  box-sizing: border-box;
  border-right: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
  will-change: transform, transition;
  transition: 0.4s transform cubic-bezier(0.19, 1, 0.22, 1);
`;

export const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
`;

export const Title = styled.div`
  ${h6()};
  margin-left: 16px;
  margin-top: 10px;
  opacity: ${transparency.light.primaryText};
`;

export const Search = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
  height: 56px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: transparent;
  -webkit-app-region: no-drag;
`;

export const Input = styled.input`
  ${body2()};
  background-color: transparent;
  outline: none;
  border: none;
  padding-left: 16px;
  width: 100%;
  height: 100%;
`;

export const SearchIcon = styled.div`
  ${centerImage('24px', 'auto')};
  opacity: ${transparency.light.inactiveIcon};
  height: 24px;
  width: 24px;
  margin-left: 16px;
  background-image: url(${icons.search});
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, 0.12);
`;
