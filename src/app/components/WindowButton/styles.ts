import styled from "styled-components";

// Enums
import { Icons } from "../../enums";

// Defaults and constants
import { HOVER_DURATION } from "../../constants/design";

// Mixins
import images from "../../../shared/mixins/images";

interface IButtonProps {
  icon: Icons;
}

export const Button = styled.div`
  height: 100%;
  -webkit-app-region: no-drag;
  width: 45px;

  transition: ${HOVER_DURATION}s background-color;

  &:hover {
    background-color: ${(props: IButtonProps) =>
      props.icon !== Icons.Close ? `rgba(196, 196, 196, 0.4)` : `#e81123`};
  }
`;

interface IIconProps {
  icon: Icons;
}

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  transition: ${HOVER_DURATION}s filter;

  background-image: ${(props: IIconProps) =>
    `url(../../src/app/icons/${props.icon})`};
  ${images.center("11px", "11px")} &:hover {
    filter: ${props => props.icon === Icons.Close && `invert(100%);`};
  }
`;
