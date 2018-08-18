import styled, { css } from 'styled-components';

import { transparency } from '../../../defaults/transparency';
import { Align } from '../../../../enums';
import { center, shadows, robotoRegular, robotoMedium } from '../../../mixins';
import { colors } from '../../../../defaults';

export const Root = styled.div`
  width: 340px;
  position: absolute;
  background-color: #fafafa;
  border-radius: 4px;
  will-change: opacity, margin-top;
  transition: 0.2s opacity, 0.2s margin-top;
  box-shadow: ${shadows(5)};
  ${center(Align.CenterBoth)};
  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'all' : 'none'};
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 0 : -24}px;
  `};
`;

export const Title = styled.div`
  font-size: 20px;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});
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
  color: rgba(0, 0, 0, ${transparency.light.secondaryText});
  ${robotoRegular()};
`;

export const KeyInput = styled.input`
  width: 100%;
  height: 48px;
  border: none;
  outline: none;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.06);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
  font-size: 16px;
  color: ${colors.blue['500']};
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${transparency.light.primaryText})`};
  -webkit-text-fill-color: transparent;
  border-bottom: 2px solid ${colors.blue['500']};

  ${robotoRegular()};
`;
