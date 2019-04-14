import styled, { css } from 'styled-components';
import { centerImage, shadows } from '~/shared/mixins';
import { icons, TOOLBAR_HEIGHT } from '../../constants';
import { colors } from '~/renderer/constants';

export const StyledOverlay = styled.div`
  color: white;
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: center;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.2s opacity;
  backface-visibility: hidden;

  background-color: black;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
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
  ${centerImage('18px', '18px')};
  margin-left: 8px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.forward});
  filter: invert(100%);
`;

export const DropArrow = styled.div`
  ${centerImage('24px', '24px')};
  margin-left: 8px;
  height: 32px;
  width: 32px;
  background-image: url(${icons.down});
  filter: invert(100%);
  border-radius: 50%;
  transition: 0.1s background-color;
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
`;

export const Section = styled.div`
  padding: 24px;
  background-color: #212121;
  margin-bottom: 24px;
  border-radius: 30px;
  color: white;
  overflow: hidden;
`;

export const Actions = styled.div`
  display: flex;
  margin-left: -16px;
  margin-top: -16px;
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

  ::-webkit-scrollbar {
    width: 6px;
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

export const Title = styled.div`
  font-size: 24px;
  margin-left: 24px;
  font-weight: 300;
  margin-bottom: 16px;
  margin-top: 24px;
  color: white;
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

export const Back = styled.div`
  ${centerImage('24px', '24px')};
  background-image: url(${icons.arrowBack});
  height: 24px;
  width: 24px;
  opacity: 0.54;
  margin-right: 24px;
  filter: invert(100%);

  &:hover {
    opacity: 1;
  }
`;

export const Menu = styled.div`
  position: absolute;
  transition: 0.2s opacity, 0.2s margin-top;
  width: 150px;
  cursor: default;
  padding: 8px 0;
  box-shadow: ${shadows(8)};
  background-color: #303030;
  border-radius: 8px;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    margin-top: ${visible ? 0 : -20}px;
  `}
`;

export const MenuItem = styled.div`
  padding: 12px 24px;
  font-weight: 400;
  font-size: 14px;

  ${({ icon, selected }: { icon?: string; selected?: boolean }) => css`
    background-color: ${selected ? 'rgba(255, 255, 255, 0.15)' : 'none'};

    &:hover {
      background-color: rgba(255, 255, 255, ${selected ? 0.15 : 0.08});
    }

    ${icon &&
      `
      padding-left: ${24 + 16 + 8}px;
      &:before {
        content: '';
        filter: invert(100%);
        opacity: 0.54;
        ${centerImage('16px', '16px')};
        width: 16px;
        height: 16px;
        left: 16px;
        position: absolute;
        background-image: url(${icon});
      }
    `}
  `}
`;

export const Downloads = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  overflow: auto;

  ::-webkit-scrollbar {
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
