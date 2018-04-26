import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { transparency, typography } from 'nersent-ui';

import { center } from '../../mixins/images';
import { invertColors } from '../../mixins/icons';

const searchIcon = require('../../icons/actions/search.svg');

export const StyledSearchInput = styled.div`
  width: 100%;
  max-width: 640px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.22);
  position: absolute;
  left: 50%;
  border-radius: 2px;
  transform: translateX(-50%);
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background-color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px 0px #fff;
  color: #fff;
  font-size: 15px;
  padding-left: 16px;
  ${typography.robotoRegular()};

  &:focus {
    outline: none;
  }

  &::-webkit-input-placeholder {
    text-shadow: 0px 0px 0px rgba(255, 255, 255, ${transparency.light.text.secondary});
    padding-left: 32px;
  }
`;

export interface ISearchIcon {
  visible: boolean;
}

export const SearchIcon = styled.div`
  width: 22px;
  height: 22px;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  background-image: url(${searchIcon});
  ${center('100%', 'auto')};
  ${invertColors()};
  display: ${(props: ISearchIcon) => (props.visible ? 'block' : 'none')};
`;
