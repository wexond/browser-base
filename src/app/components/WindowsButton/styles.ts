import styled from 'styled-components';
import images from '../../../shared/mixins/images';
import { HOVER_DURATION } from '../../constants/design';

interface IButtonProps {
  icon: string;
  isClose?: boolean;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  width: 45px;
  position: relative;

  transition: ${HOVER_DURATION}s background-color;

  &:hover {
    background-color: ${(props: IButtonProps) =>
    (!props.isClose ? 'rgba(196, 196, 196, 0.4)' : '#e81123')};
  }
`;

interface IIconProps {
  icon: string;
  isClose?: boolean;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  transition: ${HOVER_DURATION}s filter;

  background-image: ${(props: IIconProps) => `url(../../src/shared/icons/${props.icon})`};
  ${images.center('11px', '11px')};

  &:hover {
    filter: ${props => props.isClose && 'invert(100%);'};
  }
`;
