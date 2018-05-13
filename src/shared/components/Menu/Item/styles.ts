import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import typography from '../../../mixins/typography';
import userSelection from '../../../mixins/user-selection';
import opacity from '../../../defaults/opacity';

export interface IMenuItemProps {
  visible: boolean;
  hide: boolean;
  dense: boolean;
}

export const StyledMenuItem = styled.div`
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s opacity;

  opacity: ${(props: IMenuItemProps) => (props.visible ? 1 : 0)};
  display: ${props => (props.hide ? 'none' : 'flex')};
  height: ${props => (props.dense ? 24 : 32)}px;

  &:hover {
    background-color: #eee;
  }

  &:first-child {
    margin-top: ${props => (props.dense ? 4 : 8)}px;
  }

  &:last-child {
    margin-bottom: ${props => (props.dense ? 4 : 8)}px;
  }
`;

export interface ITitleProps {
  disabled: boolean;
  dense: boolean;
}

export const Title = styled.div`
  position: relative;
  left: 24px;

  ${typography.robotoRegular()};
  ${userSelection.noUserSelect()};
  opacity: ${(props: ITitleProps) =>
    (props.disabled ? opacity.light.disabledText : opacity.light.primaryText)};
  font-size: ${props => (props.dense ? 13 : 15)}px;
`;
