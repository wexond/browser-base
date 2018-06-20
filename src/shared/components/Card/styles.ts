import styled from 'styled-components';

import opacity from '../../defaults/opacity';

import typography from '../../mixins/typography';
import shadows from '../../mixins/shadows';
import images from '../../mixins/images';

export const StyledCard = styled.div`
  width: 344px;
  min-height: 72px;
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 32px;

  &:last-child {
    margin-bottom: 32px;
  }

  box-shadow: ${shadows(1)};
  ${typography.robotoRegular()};
`;

export interface IThumbnailProps {
  src: string;
}

export const Thumbnail = styled.div`
  width: 100%;
  height: 194px;

  background-image: url(${(props: IThumbnailProps) => props.src});
  ${images.center('100%', '194px')};
`;

export interface IHeaderProps {
  logo: boolean;
}

export const Header = styled.div`
  display: flex;

  justify-content: ${(props: IHeaderProps) => (!props.logo ? 'space-between' : 'unset')};
`;

export interface ILogoProps {
  src: string;
}

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 16px;
  align-self: center;
  justify-self: left;
  border-radius: 100%;

  ${images.cover()}
  background-image: url(${(props: IImageProps) => props.src});
`;

export interface IImageProps {
  src: string;
}

export const Image = styled.div`
  width: 80px;
  height: 80px;
  margin: 16px;
  align-self: center;

  ${images.cover()}
  background-image: url(${(props: IImageProps) => props.src});
`;

export const HeaderText = styled.div`
  padding: 16px;
`;

export interface ITitleProps {
  large: boolean;
}

export const Title = styled.div`
  opacity: ${opacity.light.primaryText};

  font-size: ${(props: ITitleProps) => (props.large ? 24 : 20)}px;
  ${props => (!props.large ? typography.robotoMedium() : '')};
`;

export interface ISecondaryTextProps {
  largeTop: boolean;
}

export const SecondaryText = styled.div`
  font-size: 14px;

  opacity: ${opacity.light.secondaryText};
  margin-top: ${(props: ISecondaryTextProps) => (props.largeTop ? 8 : 2)}px;
`;

export interface IIconProps {
  src: string;
}

export const Icon = styled.div`
  width: 42px;
  height: 42px;
  align-self: center;
  margin-left: auto;
  margin-right: 8px;
  cursor: pointer;
  
  ${images.center('24px', 'auto')}
  opacity: ${opacity.light.secondaryText};
  background-image: url(${(props: IIconProps) => props.src});
`;

export interface ISupportingTextProps {
  paddingTop: boolean;
}

export const SupportingText = styled.div`
  font-size: 14px;
  padding: 0px 16px 16px 16px;

  opacity: ${opacity.light.secondaryText};
  padding-top: ${(props: ISupportingTextProps) => (props.paddingTop ? 16 : 0)}px;
`;

export const Content = styled.div`
  padding: 0px 16px 0px 16px;
  font-size: 14px;

  ${typography.robotoRegular()};
`;
