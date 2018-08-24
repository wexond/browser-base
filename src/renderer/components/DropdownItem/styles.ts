import styled, { css } from 'styled-components';
import { transparency } from '~/renderer/defaults';
import { robotoRegular } from '@mixins';

export const Root = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 8px;
  font-size: 14px;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});
  will-change: background-color;
  transition: 0.2s background-color;

  ${({ selected }: { selected: boolean }) => css`
    background-color: ${selected ? 'rgba(0, 0, 0, 0.12)' : '#fff'};

    &:hover {
      background-color: ${!selected && 'rgba(0, 0, 0, 0.06)'};
    }
  `};

  &:first-child {
    margin-top: 8px;
  }

  &:last-child {
    margin-bottom: 8px;
  }

  ${robotoRegular()};
`;
