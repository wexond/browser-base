import styled from 'styled-components';

import shadows from '../../../shared/mixins/shadows';
import typography from '../../../shared/mixins/typography';
import opacity from '../../../shared/defaults/opacity';

import { EASE_FUNCTION } from '../../../shared/constants';

export interface RootProps {
  visible: boolean;
}

export const Root = styled.div`
  width: 364px;
  background-color: #fff;
  position: absolute;
  top: 56px;
  right: 0;
  z-index: 100;
  border-radius: 4px;
  padding: 16px;
  transform-origin: top right;
  will-change: transform, opacity;

  box-shadow: ${shadows(6)};
  transform: ${({ visible }: RootProps) => (visible ? 'scale(1)' : 'scale(0)')};
  transition: ${({ visible }) =>
    `0.5s ${EASE_FUNCTION} transform, ${visible ? 0.1 : 0.2}s opacity`};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const Title = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  & .material-button {
    margin-right: 16px;

    &:last-child {
      margin-right: 0px;
    }
  }
`;
