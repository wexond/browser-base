import styled from 'styled-components';
import { getOverlayScrollbarStyle } from '../Overlay/style';

export const Downloads = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  overflow: auto;

  ${(props: any) => getOverlayScrollbarStyle(props.theme)};
`;
