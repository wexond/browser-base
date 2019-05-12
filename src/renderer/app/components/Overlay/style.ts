import styled, { css } from 'styled-components';
import { centerIcon } from '~/shared/mixins';
import { icons, TOOLBAR_HEIGHT } from '../../constants';
import { Theme } from '../../models/theme';
import { transparency } from '~/renderer/constants';

export const OverlayScrollbarStyle = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.16);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.48);
  }
`;

export const Handle = styled.div`
  position: absolute;
  z-index: 9999;
  height: ${TOOLBAR_HEIGHT}px;
  left: 0;
  -webkit-app-region: drag;
  top: 0;
  right: 0;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'block' : 'none'};
  `};
`;

export const StyledOverlay = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.2s opacity, 0.2s background-color;
  backface-visibility: hidden;

  ${({ visible, theme }: { visible: boolean; theme?: Theme }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    background-color: ${theme['overlay.backgroundColor']};
    color: ${theme['overlay.foreground'] === 'light'
      ? 'white'
      : `rgba(0, 0, 0, ${transparency.text.high})`};
  `};
`;

export const HeaderText = styled.div`
  position: relative;
  display: flex;
  font-size: 16px;
  padding-left: 8px;
  padding-top: 6px;
  padding-right: 24px;
  padding-bottom: 6px;
  margin-bottom: 16px;
  margin-top: -8px;
  border-radius: 50px;
  transition: 0.1s background-color;
  cursor: pointer;

  ${({ clickable }: { clickable: boolean }) => css`
    pointer-events: ${clickable ? 'auto' : 'none'};
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const HeaderArrow = styled.div`
  ${centerIcon()};
  margin-left: 8px;
  height: 18px;
  width: 18px;
  background-image: url(${icons.forward});
  filter: invert(100%);
`;

export const DropArrow = styled.div`
  ${centerIcon(24)};
  margin-left: 8px;
  height: 32px;
  width: 32px;
  background-image: url(${icons.down});
  border-radius: 50%;
  transition: 0.1s background-color;

  ${({ theme }: { theme?: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `}
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
`;

export const Section = styled.div`
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 30px;
  overflow: hidden;
  transition: 0.2s background-color;

  ${({ theme }: { theme?: Theme }) => css`
    background-color: ${theme['overlay.section.backgroundColor']};
  `}
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Scrollable = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-flow: column;
  align-items: center;

  ${OverlayScrollbarStyle};
`;

export const Title = styled.div`
  font-size: 24px;
  margin-left: 24px;
  font-weight: 300;
  margin-bottom: 16px;
  margin-top: 24px;
  position: relative;
  display: flex;
  padding-right: 42px;

  &:hover {
    ${DropArrow} {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
`;

export const Container = styled.div`
  position: absolute;
  transition: 0.2s transform, 0.2s opacity, 0.2s visibility;
  will-change: transform, opacity, pointer-events;
  backface-visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  ${({ visible, right }: { visible: boolean; right?: boolean }) => css`
    transform: translateX(${visible ? 0 : right ? 32 : -32}px);
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 800px;
`;
