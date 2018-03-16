import styled from "styled-components";

// Constants and defaults
import { TOOLBAR_HEIGHT } from "../../constants/design";

// Enums
import { Platforms } from "../../../shared/enums";

import Store from "../../store";

interface IStyledToolbarProps {
  isFullscreen: boolean;
}

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${TOOLBAR_HEIGHT}px;
  display: flex;
  -webkit-app-region: drag;
  background-color: #fff;
  padding-left: ${(props: IStyledToolbarProps) => !props.isFullscreen && Store.platform === Platforms.MacOS
    ? 78
    : 0}px;
`;
