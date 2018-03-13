import styled from "styled-components";

import { shadows } from "nersent-ui";
import { SYSTEM_BAR_HEIGHT } from "../../constants/design";

import Store from "../../store";

import { Platforms } from "../../../shared/enums";

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${SYSTEM_BAR_HEIGHT}px;
  display: flex;
  -webkit-app-region: drag;
  background-color: #fff;
  padding-left: ${Store.platform === Platforms.MacOS && !Store.isFullscreen ? 78 : 0}px;
`;
