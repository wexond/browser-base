import styled from "styled-components";

import { SYSTEM_BAR_HEIGHT } from "../../constants/design";

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${SYSTEM_BAR_HEIGHT}px;
  display: flex;
  -webkit-app-region: drag;
  background-color: #fff;
`;
