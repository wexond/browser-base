import styled from 'styled-components';

export interface Props {
  visible: boolean;
}

export const Root = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  position: fixed;
  display: flex;
  transition: 0.2s opacity;
  will-change: transition;

  opacity: ${({ visible }: Props) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }: Props) => (visible ? 'auto' : 'none')};
`;

export const ItemsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-self: center;
  z-index: 1;
`;

export const Dark = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;
