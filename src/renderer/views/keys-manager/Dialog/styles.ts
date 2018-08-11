import styled from 'styled-components';

import { opacity } from '../../../../defaults/opacity';
import { Align } from '../../../../enums';
import {
  center, shadows, robotoRegular, robotoMedium,
} from '../../../mixins';

export const Root = styled.div`
  width: 340px;
  position: absolute;
  background-color: #fafafa;
  border-radius: 4px;
  box-shadow: ${shadows(5)};

  ${center(Align.CenterBoth)};
`;

export const Title = styled.div`
  font-size: 20px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
  margin-top: 24px;
  padding-left: 24px;
  padding-right: 32px;

  ${robotoMedium()};
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & .material-button {
    margin-right: 8px;
    padding-right: 8px;
    padding-left: 8px;
  }
`;

export const Content = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  font-size: 16px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  ${robotoRegular()};
`;
