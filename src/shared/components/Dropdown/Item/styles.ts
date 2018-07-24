import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../../defaults/opacity';
import typography from '../../../mixins/typography';

export const Root = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 8px;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
  will-change: background-color;
  transition: 0.2s background-color;

  ${({ selected }: { selected: boolean }) => `
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

  ${typography.robotoRegular()};
`;
