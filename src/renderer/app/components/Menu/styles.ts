import styled, { css } from 'styled-components';

import { MENU_CONTENT_MAX_WIDTH, MENU_SPACE, MENU_WIDTH } from '~/constants';
import { transparency, icons } from '~/renderer/defaults';
import { body2, centerImage, h6, shadows, noButtons } from '@mixins';

export const Container = styled.div`
  height: 100%;
  width: 300px;
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
  ${h6()};
  margin-left: 16px;
  margin-top: 10px;
  opacity: ${transparency.light.primaryText};
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
  border-left: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
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
  background-color: #fafafa;
  position: absolute;
  right: 299px;
  overflow: hidden;
  transition: 0.2s opacity;
  width: ${getWidth()};
  will-change: transition, opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};

  @media (max-width: ${MENU_CONTENT_MAX_WIDTH + MENU_WIDTH + MENU_SPACE}px) {
    max-width: calc(100vw - ${MENU_WIDTH + MENU_SPACE}px);
  }
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

export const PageContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  ${noButtons('10px')};
`;

export const PageContainer = styled.div`
  width: calc(100% - 64px);
  max-width: 640px;
  padding-bottom: 32px;
  margin: 0 auto;
`;
