import styled, { css } from 'styled-components';
import { centerIcon, overline, maxLines, shadows } from '~/renderer/mixins';

export const Img = styled.div`
  transition: 0.5s opacity;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  height: 100%;
  transition: 0.5s opacity, 0.2s transform;
  will-change: opacity;

  ${({ src }: { src: string }) => css`
    opacity: ${src === '' ? 0 : 1};
    background-image: url(${src});
  `};
`;

export const StyledNewsItem = styled.a`
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  color: white;
  text-decoration: none;
  cursor: pointer;
  animation: fadein 0.3s;
  will-change: opacity;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &:after {
    content: '';

    ${({ fullSize }: { fullSize?: boolean }) => css`
      background-image: ${fullSize
        ? 'linear-gradient(to left, transparent, #000)'
        : 'linear-gradient(transparent, #000)'};
      opacity: ${fullSize ? 0.75 : 0.85};
    `};

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    opacity: 0;
    z-index: 2;
    transition: 0.2s opacity;
  }

  &:hover {
    & ${Img} {
      transform: scale(1.1);
    }

    &:before {
      opacity: 0.3;
    }
  }
`;

export const Title = styled.div`
  font-weight: 500;
  line-height: 1.75rem;
  ${maxLines(3)};
  font-size: 20px;
  line-height: 1.75rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

export const Footer = styled.div`
  display: flex;
  margin-top: 16px;
`;

export const Fill = styled.div`
  flex: 2;
`;

export const Source = styled.div`
  opacity: 0.54;
  font-size: 12px;
`;

export const SourceIcon = styled.div`
  width: 16px;
  height: 16px;
  ${centerIcon()};
  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};
`;

export const Info = styled.div`
  padding: 24px;
  z-index: 2;
  display: flex;
  flex-flow: column;
  position: absolute;
  max-width: 350px;
  bottom: 0;

  ${({ fullSize }: { fullSize?: boolean }) => css`
    top: ${fullSize ? 0 : 'auto'};
  `};
`;

export const Overline = styled.div`
  ${overline()};
  opacity: 0.54;
  margin-bottom: 8px;
  font-size: 10px;
`;

export const Description = styled.div`
  overflow: hidden;
  margin-top: 8px;
  line-height: 1.5rem;
  position: relative;
  ${maxLines(3)};
  opacity: 0.8;
`;
