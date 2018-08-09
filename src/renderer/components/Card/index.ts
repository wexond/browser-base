import styled, { css } from 'styled-components';

import { centerImage, coverImage, h6, h5, body2 } from '../../mixins';
import { opacity } from '../../../defaults';

const getCardImageOpacity = (visible: boolean) => {
  if (visible != null) return visible ? 1 : 0;
  return 1;
};

export const Root = styled.div`
  width: 344px;
  min-height: 72px;
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;

export const Thumbnail = styled.div`
  width: 100%;
  height: 194px;

  background-image: url(${({ src }: { src: string }) => src});
  ${centerImage('100%', '194px')};
`;

export const Header = styled.div`
  display: flex;
  flex-flow: column;
  padding: 16px;
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 16px;
  align-self: center;
  justify-self: left;
  border-radius: 100%;
  ${coverImage()};

  background-image: url(${({ src }: { src: string }) => src});
`;

export interface ImageProps {
  src: string;
  visible?: boolean;
}

export const Image = styled.div`
  min-width: 80px;
  height: 80px;
  margin: 16px;
  align-self: center;
  transition: 0.2s opacity;
  ${coverImage()};

  ${({ src, visible }: ImageProps) => css`
    background-image: url(${src});
    opacity: ${getCardImageOpacity(visible)};
  `};
`;

export const Title = styled.div`
  opacity: ${opacity.light.primaryText};

  ${({ large }: { large: boolean }) => css`
    ${large ? h5() : h6()};
  `};
`;

export const SecondaryText = styled.div`
  ${body2()};
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  margin-top: ${({ largeTop }: { largeTop?: boolean }) => (largeTop ? 8 : 2)}px;
`;

export const Icon = styled.div`
  width: 42px;
  height: 42px;
  align-self: center;
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
  ${centerImage('24px', 'auto')}
  opacity: ${opacity.light.secondaryText};

  background-image: url(${({ src }: { src: string }) => src});
`;

export const SupportingText = styled.div`
  ${body2()};
  padding: 0px 16px 16px 16px;
  opacity: ${opacity.light.secondaryText};

  padding-top: ${({ paddingTop }: { paddingTop?: boolean }) =>
    paddingTop ? 16 : 0}px;
`;

export const Content = styled.div`
  ${body2()};
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
`;

export const Actions = styled.div`
  width: 100%;
  padding: 8px;
  margin-top: 24px;
  display: flex;
  align-content: center;
`;

export const ActionButtonStyle = {
  marginLeft: 8,
  paddingLeft: 8,
  paddingRight: 8,
};
