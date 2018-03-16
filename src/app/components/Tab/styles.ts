import styled from "styled-components";

// Constants and defaults
import { transparency } from "nersent-ui";

// Mixins
import images from "../../../shared/mixins/images";

interface IStyledTabProps {
  selected: boolean;
  isRemoving: boolean;
  visible: boolean;
}

export const StyledTab = styled.div`
  transform: translateZ(0);
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  height: calc(100% - 2px);
  background-color: white;

  z-index: ${(props: IStyledTabProps) => (props.selected ? 2 : 1)};
  pointer-events: ${props => props.isRemoving || !props.visible ? "none" : "auto"};
  -webkit-app-region: ${props => props.visible ? "no-drag" : ""};
`;

interface ITitleProps {
  hovered: boolean;
}

export const Title = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s opacity, 0.1s max-width;
  font-weight: 500;
  text-transform: uppercase;

  max-width: ${(props: ITitleProps) => `calc(100% - ${24 + (props.hovered ? 24 : 0)}px)`};
  transform: ${props => `translate(-50%, -50%)`};
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
  top: 50%;
  transform: translateY(-50%);

  opacity: ${(props: ICloseProps) => props.hovered ? transparency.light.icons.inactive : 0};
  ${images.center("100%", "100%")};
`;
