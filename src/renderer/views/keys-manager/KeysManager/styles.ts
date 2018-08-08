import styled from "styled-components";

import { noButtons } from "../../../mixins";

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  overflow-x: hidden;
  overflow-y: auto;

  ${noButtons("10px")};
`;
