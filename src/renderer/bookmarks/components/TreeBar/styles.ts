import styled from 'styled-components';

import { icons, transparency } from '@/constants/renderer';
import { centerImage } from '@/mixins';

export const Root = styled.div`
  width: calc(100vw - 256px);
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, ${transparency.light.dividers});
  overflow: hidden;
  background-color: white;
  position: absolute;
  top: 0px;
  left: 256px;
`;

export const ForwardIcon = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 4px;
  background-image: url(${icons.forward});
  opacity: ${transparency.light.inactiveIcon};

  ${centerImage('100%', 'auto')};
`;
