import React from 'react';

import {
  StyledCard,
  Thumbnail,
  Header,
  HeaderText,
  Title,
  SecondaryText,
  Logo,
  Image,
  Icon,
  SupportingText,
  Content,
} from './styles';

export interface CardProps {
  title?: string;
  largeTitle?: boolean;
  secondaryText?: string;
  thumbnail?: string;
  thumbnailOnBottom?: boolean;
  logo?: string;
  image?: string;
  icon?: string;
  supportingText?: any;
  children?: any;
  style?: any;
}

export default class Card extends React.Component<CardProps, {}> {
  public static defaultProps = {
    title: 'Title goes here',
    secondaryText: 'Secondary text',
    thumbnailOnBottom: false,
    largeTitle: false,
  };

  public render() {
    const {
      title,
      largeTitle,
      secondaryText,
      thumbnail,
      thumbnailOnBottom,
      logo,
      image,
      icon,
      supportingText,
      children,
      style,
    } = this.props;

    const _thumbnail = (bottom = false) => {
      if (thumbnail && (!bottom === !thumbnailOnBottom || bottom === thumbnailOnBottom)) {
        return <Thumbnail src={thumbnail} />;
      }

      return null;
    };

    return (
      <StyledCard style={style}>
        {_thumbnail()}
        {title && (
          <Header logo={!!logo}>
            {logo && <Logo src={logo} />}
            <HeaderText>
              <Title large={largeTitle}>{title}</Title>
              <SecondaryText largeTop={!!supportingText || largeTitle}>
                {secondaryText}
              </SecondaryText>
            </HeaderText>
            {image && <Image src={image} />}
            {icon && <Icon src={icon} />}
          </Header>
        )}
        {_thumbnail(true)}
        {supportingText && (
          <SupportingText paddingTop={thumbnailOnBottom}>{supportingText}</SupportingText>
        )}
        {children && <Content>{children}</Content>}
      </StyledCard>
    );
  }
}
