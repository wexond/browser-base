import styled, { css } from 'styled-components';
import { EASE_FUNCTION } from '~/constants';
import { transparency, icons } from '~/renderer/defaults';
import { centerImage, robotoRegular, shadows } from '@mixins';

export const Root = styled.div`
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
`;

export const Container = styled.div`
  min-width: 104px;
  height: 48px;
  padding-left: 16px;
  padding-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Name = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});

  ${robotoRegular()};
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  will-change: transform;
  transition: 0.3s transform;
  opacity: ${transparency.light.inactiveIcon};
  background-image: url(${icons.dropDown});

  ${centerImage('24px', 'auto')};

  ${({ activated }: { activated: boolean }) => css`
    transform: rotate(${activated ? 180 : 0}deg);
  `};
`;

export const List = styled.div`
  width: 100%;
  position: absolute;
  top: calc(100% - 4px);
  left: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #fff;
  border-radius: 4px;
  will-change: max-height;
  opacity: 0;
  transition: 0.5s max-height ${EASE_FUNCTION}, 0.2s opacity;
  box-shadow: ${shadows(7)};

  ${({ activated, height }: { activated: boolean; height: number }) => css`
    max-height: ${height}px;
    opacity: ${activated ? 1 : 0};
  `};
`;
