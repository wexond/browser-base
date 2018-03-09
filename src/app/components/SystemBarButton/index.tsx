import React, { SFC } from "react";
import styled from "styled-components";

import { join } from "path";

import {
  HOVER_DURATION,
  SYSTEM_BAR_HEIGHT,
  SYSTEM_BAR_WINDOWS_BUTTON_WIDTH
} from "../../constants/design";

import { SystemBarIcons } from "../../enums";

import images from "../../../shared/mixins/images";

import { tabTransitions } from "../../defaults/tabs";

interface IProps extends IButtonProps {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
}

const SystemBarButton: SFC<IProps> = ({
  windows,
  icon,
  onClick,
  size,
  style
}) => {
  return (
    <Button onClick={onClick} windows={windows} icon={icon} style={style}>
      <Icon icon={icon} windows={windows} size={size} />
    </Button>
  );
};

SystemBarButton.defaultProps = {
  icon: SystemBarIcons.Add,
  size: 20,
  windows: false
};

export default SystemBarButton;

interface IIconProps extends IButtonProps {
  size: number;
}

const Icon = styled.div`
  width: 100%;
  height: 100%;
  transition: ${HOVER_DURATION}s all;

  ${(props: IIconProps) =>
    props.windows
      ? images.center("11px", "11px")
      : images.center(props.size + "px", props.size + "px")}

  background-image: url(${props => "../../src/app/icons/" + props.icon});

  &:hover {
    ${props => props.icon === SystemBarIcons.Close && `filter: invert(100%);`}
  }
`;

interface IButtonProps {
  windows?: boolean;
  icon: SystemBarIcons;
}

const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;

  width: ${(props: IButtonProps) =>
    props.windows ? SYSTEM_BAR_WINDOWS_BUTTON_WIDTH : SYSTEM_BAR_HEIGHT}px;

  transition: ${HOVER_DURATION}s background-color;

  &:hover {
    background-color: ${props =>
      props.icon !== SystemBarIcons.Close
        ? `rgba(196, 196, 196, 0.4)`
        : `#e81123`};
  }
`;
