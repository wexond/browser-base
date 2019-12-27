import styled, { css } from 'styled-components';

export const StyledApp = styled.div`
  margin: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  overflow: overlay;
  position: relative;
  transition: 0.2s opacity, 0.2s margin-top;
  background-color: white;
  width: fit-content;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 3 : 10}px;
  `};
`;
