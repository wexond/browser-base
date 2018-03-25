import styled from 'styled-components';

// Constants and defaults
import { transparency } from 'nersent-ui';

// Mixins
import images from '../../../shared/mixins/images';

interface IStyledTabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
  hovered: boolean;
  dragging: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  height: calc(100% - 2px);
  display: flex;
  align-items: center;
  transition: 0.2s background-color;

  z-index: ${(props: IStyledTabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => (props.isRemoving || !props.visible ? 'none' : 'auto')};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  background-color: ${(props) => {
    if (props.hovered && !props.dragging) {
      return 'rgba(0,0,0,0.08)';
    } else if (props.dragging) {
      return '#fafafa';
    }
    return 'none';
  }};
`;

interface ITitleProps {
  hovered: boolean;
}

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s opacity;
  font-weight: 500;
  margin-left: 12px;

  opacity: ${transparency.light.text.primary};
`;

interface ICloseProps {
  hovered: boolean;
}

export const Close = styled.div`
  position: absolute;
  right: 12px;
  height: 16px;
  width: 16px;
  background-image: url(../../src/app/icons/actions/close.svg);
  transition: 0.2s opacity;

  opacity: ${(props: ICloseProps) => (props.hovered ? transparency.light.icons.inactive : 0)};
  ${images.center('100%', '100%')};
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  border: 1px dotted black;
`;

interface IContentProps {
  hovered: boolean;
}

export const Content = styled.div`
  position: absolute;
  left: 50%;
  overflow: hidden;
  display: flex;
  transition: 0.1s max-width, 0.1s transform;

  transform: ${(props: IContentProps) =>
    (props.hovered ? 'translateX(calc(-50% - 12px))' : 'translateX(-50%)')};
  max-width: ${props => `calc(100% - ${24 + (props.hovered ? 24 : 0)}px)`};
`;
