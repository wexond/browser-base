import styled, { css } from 'styled-components';
import images from '../../../shared/mixins/images';
import shadows from '../../../shared/mixins/shadows';
import opacity from '../../../shared/defaults/opacity';
import typography from '../../../shared/mixins/typography';

export interface StyledProps {
  visible: boolean;
  contentVisible: boolean;
}

export const Styled = styled.div`
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

  ${({ visible }: StyledProps) => css`
    transform: translateX(${visible ? 0 : 320}px);
  `};
`;

export const Title = styled.div`
  font-size: 20px;
  margin-left: 16px;
  margin-top: 10px;
  opacity: ${opacity.light.primaryText};
  letter-spacing: 0.007rem;
  ${typography.robotoMedium()};
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  height: 56px;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
`;

interface DarkProps {
  visible: boolean;
}

export const Dark = styled.div`
  background-color: rgba(0, 0, 0, 0.54);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: 0.2s opacity;

  ${({ visible }: DarkProps) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const NavContent = styled.div`
  width: 300px;
  border-left: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  position: relative;
  z-index: 999;
  display: flex;
  flex-flow: column;
  transition: 0.2s all;
`;

interface ContentProps {
  visible: boolean;
}

const getWidth = () => {
  const maxWidth = 640 + 64;

  if (window.innerWidth - 300 - 96 > maxWidth) {
    return `${maxWidth}px`;
  }

  return 'calc(100vw - 300px - 96px)';
};

export const Content = styled.div`
  height: 100%;
  max-width: calc(640px + 64px);
  transition: 0.5s width cubic-bezier(0.19, 1, 0.22, 1);
  overflow: auto;
  background-color: #fafafa;
  position: relative;

  ${({ visible }: ContentProps) => css`
    width: ${visible ? getWidth() : 0};
  `};
`;
