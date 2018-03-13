import styled from "styled-components";

export const NavIcons = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  overflow: hidden;
`;
