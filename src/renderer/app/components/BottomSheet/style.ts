import styled, { css } from 'styled-components';

export const StyledBottomSheet = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 99999;
  background-color: white;
  border-radius: 8px;
  left: 50%;
  width: 512px;
  transition: 0.2s transform;
  color: black;

  ${({ visible }: { visible: boolean }) => css`
    transform: translate(-50%, ${visible ? '8px' : '100%'});
  `};
`;

export const SmallBar = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  height: 4px;
  width: 32px;
  background-color: rgba(0, 0, 0, 0.12);
  margin-top: 8px;
`;

export const Content = styled.div`
  padding: 16px 0 24px 0;
`;
