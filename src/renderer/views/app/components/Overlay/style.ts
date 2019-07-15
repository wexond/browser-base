import styled, { css } from 'styled-components';

import { TOOLBAR_HEIGHT } from '../../constants';
import { transparency, icons } from '~/renderer/constants';
import { centerIcon, robotoMedium } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const getOverlayScrollbarStyle = (theme: ITheme) => {
  return `
    ::-webkit-scrollbar {
      width: 6px;
      height: 3px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme['overlay.scrollbar.backgroundColor']};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${theme['overlay.scrollbar.hover.backgroundColor']};
    }
  `;
};

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
  top: ${TOOLBAR_HEIGHT}px;
  bottom: 0;
  right: 0;
  z-index: 9999;
  backface-visibility: hidden;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    transition: ${theme.animations
      ? '0.2s opacity, 0.2s background-color'
      : 'none'};
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

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['overlay.section.backgroundColor']};
    transition: ${theme.animations ? '0.2s background-color' : 'none'};
  `}
`;

export const EmptySection = styled.div`
  margin-top: 16px;
  padding: 0px 0px 8px 0px;
  overflow: hidden;

  &:first-child {
    margin-top: 48px;
  }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  padding: 16px 24px;
  ${robotoMedium()};
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

  ${(props: any) => getOverlayScrollbarStyle(props.theme)};
`;

export const Title = styled.div`
  font-size: 24px;
  margin-left: 16px;
  font-weight: 300;
  margin-bottom: 10px;
  margin-top: 24px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  padding-right: 6px;
  border-radius: 4px;
  width: fit-content;
`;

interface ContainerProps {
  visible: boolean;
  right?: boolean;
  theme?: ITheme;
}

export const StyledContainer = styled.div`
  position: absolute;
  will-change: transform, opacity, pointer-events;
  backface-visibility: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  ${({ visible, right, theme }: ContainerProps) => css`
    transition: ${theme.animations
      ? '0.2s transform, 0.2s opacity, 0.2s visibility'
      : 'unset'};
    transform: translateX(${visible ? 0 : right ? 32 : -32}px);
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 800px;
`;

export const Scrollable2 = styled(Scrollable)`
  flex-flow: row;
  align-items: unset;
`;

export const Sections = styled.div`
  margin-left: ${323 + 56}px;
  width: calc(100% - 300px);
  display: flex;
  flex-flow: column;
  flex: 1;
`;

export const DialogsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: 0.15s opacity;

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
  `}
`;

export const Dark = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.54);
`;
