import styled from 'styled-components';

import opacity from '../../defaults/opacity';

import typography from '../../mixins/typography';
import shadows from '../../mixins/shadows';
import images from '../../mixins/images';

const getCardImageOpacity = (visible: boolean) => {
  if (visible != null) return visible ? 1 : 0;
  return 1;
};

export const Card = styled.div`
  width: 344px;
  min-height: 72px;
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;

  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
  ${typography.robotoRegular()};
`;

export interface ThumbnailProps {
  src: string;
}

export const CardThumbnail = styled.div`
  width: 100%;
  height: 194px;

  background-image: url(${({ src }: ThumbnailProps) => src});
  ${images.center('100%', '194px')};
`;

export interface HeaderProps {
  logo?: boolean;
}

export const CardHeader = styled.div`
  display: flex;

  justify-content: ${({ logo }: HeaderProps) => (!logo ? 'space-between' : 'unset')};
`;

export interface LogoProps {
  src: string;
}

export const CardLogo = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 16px;
  align-self: center;
  justify-self: left;
  border-radius: 100%;

  ${images.cover()}
  background-image: url(${({ src }: ImageProps) => src});
`;

export interface ImageProps {
  src: string;
  visible?: boolean;
}

export const CardImage = styled.div`
  min-width: 80px;
  height: 80px;
  margin: 16px;
  align-self: center;
  transition: 0.2s opacity;

  ${images.cover()}
  background-image: url(${({ src }: ImageProps) => src});
  opacity: ${({ visible }) => getCardImageOpacity(visible)};
`;

export const CardHeaderText = styled.div`
  padding: 16px;
`;

export interface TitleProps {
  large?: boolean;
}

export const CardTitle = styled.div`
  opacity: ${opacity.light.primaryText};

  font-size: ${({ large }: TitleProps) => (large ? 24 : 20)}px;
  ${({ large }) => (!large ? typography.robotoMedium() : '')};
`;

export interface SecondaryTextProps {
  largeTop?: boolean;
}

export const CardSecondaryText = styled.div`
  font-size: 14px;

  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  margin-top: ${({ largeTop }: SecondaryTextProps) => (largeTop ? 8 : 2)}px;
`;

export interface IconProps {
  src: string;
}

export const CardIcon = styled.div`
  width: 42px;
  height: 42px;
  align-self: center;
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
  
  ${images.center('24px', 'auto')}
  opacity: ${opacity.light.secondaryText};
  background-image: url(${({ src }: IconProps) => src});
`;

export interface SupportingTextProps {
  paddingTop?: boolean;
}

export const CardSupportingText = styled.div`
  font-size: 14px;
  padding: 0px 16px 16px 16px;

  opacity: ${opacity.light.secondaryText};
  padding-top: ${({ paddingTop }: SupportingTextProps) => (paddingTop ? 16 : 0)}px;
`;

export const CardContent = styled.div`
  font-size: 14px;

  ${typography.robotoRegular()};
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
`;

export const CardActions = styled.div`
  width: 100%;
  padding: 8px;
  margin-top: 24px;
  display: flex;
  align-content: center;
`;

export const CardActionButtonStyle = {
  marginLeft: 8,
  paddingLeft: 8,
  paddingRight: 8,
};
