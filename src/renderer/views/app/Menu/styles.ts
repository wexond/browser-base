import styled, { css } from 'styled-components';
import { MENU_WIDTH, MENU_CONTENT_MAX_WIDTH, MENU_SPACE } from '../../../constants';
import shadows from '../../../mixins/shadows';
import typography from '../../../mixins/typography';
import opacity from '../../../defaults/opacity';
import images from '../../../mixins/images';

export const Container = styled.div`
  height: 100%;
  position: fixed;
  display: flex;
  top: 0;
  background-color: #fff;
  z-index: 9999;
  transition: 0.4s transform cubic-bezier(0.19, 1, 0.22, 1);
  box-sizing: border-box;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  right: 0;
  box-shadow: ${shadows(16)};
  will-change: transform, transition;
  -webkit-app-region: no-drag;

  ${({ visible }: { visible: boolean }) => css`
    transform: translateX(${visible ? 0 : MENU_WIDTH + 20}px);
  `};
`;

export const Title = styled.div`
  ${typography.h6()};
  margin-left: 16px;
  margin-top: 10px;
  opacity: ${opacity.light.primaryText};
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  height: 56px;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
`;

export const Dark = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: 0.2s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const Menu = styled.div`
  width: 300px;
  border-left: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  position: relative;
  z-index: 999;
  display: flex;
  flex-flow: column;
  transition: 0.2s all;
  will-change: transition;
`;

const getWidth = () => {
  const maxWidth = MENU_CONTENT_MAX_WIDTH;

  if (window.innerWidth - MENU_WIDTH - MENU_SPACE > maxWidth) {
    return `${maxWidth}px`;
  }

  return `calc(100vw - ${MENU_WIDTH + MENU_SPACE}px)`;
};

export const Content = styled.div`
  height: 100%;
  max-width: ${MENU_CONTENT_MAX_WIDTH}px;
  transition: 0.5s width cubic-bezier(0.19, 1, 0.22, 1);
  background-color: #fafafa;
  position: relative;
  overflow: hidden;
  will-change: width, transition;

  ${({ visible }: { visible: boolean }) => css`
    width: ${visible ? getWidth() : 0};
  `};

  @media (max-width: ${MENU_CONTENT_MAX_WIDTH + MENU_WIDTH + MENU_SPACE}px) {
    max-width: calc(100vw - ${MENU_WIDTH + MENU_SPACE}px);
  }
`;

export const Search = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
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
  ${typography.body2()};
  background-color: transparent;
  outline: none;
  border: none;
  padding-left: 16px;
  width: 100%;
  height: 100%;
`;

export const SearchIcon = styled.div`
  ${images.center('24px', 'auto')};
  opacity: ${opacity.light.inactiveIcon};
  height: 24px;
  width: 24px;
  margin-left: 16px;
  background-image: url(${searchIcon});
`;
