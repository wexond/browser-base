import * as React from "react";
import styled from "styled-components";

import { join } from "path";

import {
  HOVER_DURATION,
  SYSTEM_BAR_HEIGHT,
  SYSTEM_BAR_WINDOWS_BUTTON_WIDTH
} from "../../constants/design";

import { SystemBarIcons } from "../../enums";

import images from "../../../shared/mixins/images";

interface IProps extends IButtonProps {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
}

interface IButtonProps {
  windows?: boolean;
  icon: SystemBarIcons;
}

interface IIconProps extends IButtonProps {
  size: number;
}

export default class SystemBarButton extends React.Component<IProps, {}> {
  public static defaultProps = {
    icon: "",
    size: 20,
    windows: false
  };

  public render() {
    const { windows, icon, onClick, size, style } = this.props;

    return (
      <Button onClick={onClick} windows={windows} icon={icon} style={style}>
        <Icon icon={icon} windows={windows} size={size} />
      </Button>
    );
  }
}

const Icon = styled.div`
  width: 100%;
  height: 100%;
  transition: ${HOVER_DURATION}s all;

  ${(props: IIconProps) => `
    ${
      props.windows
        ? images.center("11px", "11px")
        : images.center(props.size + "px", props.size + "px")
    }
    background-image: url(${"../../src/app/icons/" + props.icon});

    &:hover {
      ${props.icon === SystemBarIcons.Close && `filter: invert(100%);`}
    }
  `};
`;

const Button = styled.div`
  height: 100%;
  transition: ${HOVER_DURATION}s all;
  -webkit-app-region: no-drag;
  ${(props: IButtonProps) => `
    width: ${
      props.windows ? SYSTEM_BAR_WINDOWS_BUTTON_WIDTH : SYSTEM_BAR_HEIGHT
    }px;

    &:hover {
      background-color: ${
        props.icon !== SystemBarIcons.Close
          ? `rgba(196, 196, 196, 0.4)`
          : `#e81123`
      };
    }
  `};
`;
