import styled from 'styled-components';

import { opacity } from '../../../../defaults';
import { noButtons, robotoMedium } from '../../../mixins';

export const Toolbar = styled.div`
  width: calc(100% - 300px);
  height: 56px;
  box-sizing: border-box;
  background-color: #fff;
  position: fixed;
  z-index: 999;
  top: 0;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
`;

export const Title = styled.div`
  font-size: 32px;
  margin-top: 56px;
  margin-left: 64px;
  opacity: ${opacity.light.primaryText};

  ${robotoMedium()};
`;
