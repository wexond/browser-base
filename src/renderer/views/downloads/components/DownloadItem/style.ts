import styled from 'styled-components';
import { BLUE_500 } from '~/renderer/constants';

export const StyledDownloadItem = styled.div`
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const Title = styled.div``;

export const Progress = styled.div`
  position: absolute;
  height: 6px;
  background-color: ${BLUE_500};
  bottom: 0;
  left: 0;
  border-radius: 8px;
`;
