import styled, { css } from 'styled-components';
import { centerImage } from '@mixins';

interface ButtonProps {
  icon: string;
  isClose?: boolean;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  width: 45px;
  position: relative;

  margin-right: 1px;

  &:first-child {
    margin-right: 0;
  }

  transition: 0.2ss background-color;

  &:hover {
    background-color: ${({ isClose }: ButtonProps) =>
      !isClose ? 'rgba(196, 196, 196, 0.4)' : '#e81123'};
  }
`;

interface IconProps {
  icon: string;
  isClose?: boolean;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  transition: 0.2ss filter;
  ${centerImage('11px', '11px')};

  ${({ icon, isClose }: IconProps) => css`
    background-image: url(${icon});

    &:hover {
      filter: ${isClose && 'invert(100%)'};
    }
  `};
`;
