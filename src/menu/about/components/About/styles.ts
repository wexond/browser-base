import styled from 'styled-components';
import { center } from '../../../../shared/mixins/images';

const wexondIcon = require('../../../../shared/icons/wexond.png');

export const Content = styled.div`
  max-width: 640px;
  width: calc(100% - 64px);
  padding-bottom: 32px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
`;

export const Logo = styled.div`
  width: 196px;
  height: 196px;
  margin: 0 auto;
  margin-top: 32px;
  background-image: url(${wexondIcon});

  ${center('100%', 'auto')};
`;

export const Card = styled.div`
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 32px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;
