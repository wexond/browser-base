import styled from "styled-components";

// Constants and defaults
import { TOOLBAR_HEIGHT } from "../../constants/design";

// Enums
import { Platforms } from "../../../shared/enums";

import Store from "../../store";

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${TOOLBAR_HEIGHT}px;
  display: flex;
  -webkit-app-region: drag;
  background-color: #fff;
  padding-left: ${Store.platform === Platforms.MacOS && !Store.isFullscreen
    ? 78
    : 0}px;
`;
