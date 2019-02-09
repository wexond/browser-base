import styled from 'styled-components';

export const Root = styled.div`
  position: absolute;
  height: 3px;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  display: ${({ visible }: { visible: boolean }) =>
    visible ? 'block' : 'none'};
`;

export const Thumb = styled.div`
  position: absolute;
  background-color: black;
  height: 100%;
  top: 0;
  left: 0;
  transition: 0.2s opacity;
  -webkit-app-region: no-drag;
  opacity: ${({ visible }: { visible: boolean }) => (visible ? 0.2 : 0)};
  &:hover {
    opacity: 0.4;
  }
  &:active {
    opacity: 0.4;
  }
`;
