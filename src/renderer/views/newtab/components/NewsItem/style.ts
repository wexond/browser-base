import styled, { css } from 'styled-components';
import { centerIcon, overline, maxLines } from '~/renderer/mixins';

export const StyledNewsItem = styled.div`
  background-color: #424242;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

export const Image = styled.div`
  background-size: cover;
  background-position: center;
  transition: 0.5s opacity;

  ${({ src, fullSize }: { src?: string; fullSize?: boolean }) => css`
    opacity: ${src === '' ? 0 : 1};
    background-image: url(${src});
    height: ${fullSize ? 100 : 50}%;

    ${fullSize &&
      css`
        &:after {
          content: '';
          background: linear-gradient(transparent, #000000);
          opacity: 0.75;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
        }
      `}
  `};
`;

export const Title = styled.div`
  font-weight: 500;
  line-height: 1.75rem;
  ${maxLines(3)};

  ${({ fullSize }: { fullSize?: boolean }) => css`
    font-size: ${fullSize ? 32 : 20}px;
    line-height: ${fullSize ? 2.75 : 1.75}rem;
  `};
`;

export const Footer = styled.div`
  display: flex;
  margin-top: 16px;
`;

export const Fill = styled.div`
  flex: 1;
`;

export const Source = styled.div`
  margin-left: 8px;
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
  bottom: 0;
  padding: 16px;
  z-index: 2;
  display: flex;
  flex-flow: column;

  ${({ fullSize }: { fullSize?: boolean }) => css`
    position: ${fullSize ? 'absolute' : 'relative'};
    height: ${fullSize ? 'auto' : '50%'};
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
  line-height: 1.6rem;
  flex: 1;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0 -20px;
    width: calc(100% + 40px);
    height: 60px;
    box-shadow: inset 0 -20px 30px 0 #424242;
  }
`;
