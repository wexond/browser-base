import styled from 'styled-components';

import { centerImage } from '@/mixins';

const wexondIcon = require('../../../../../static/app-icons/icon.png');

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
`;

export const Logo = styled.div`
  width: 196px;
  height: 196px;
  margin: 0 auto;
  margin-top: 32px;
  background-image: url(${wexondIcon});

  ${centerImage('100%', 'auto')};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 512px;
  height: auto;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 32px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;
