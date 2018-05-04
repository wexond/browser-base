import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { transparency, typography } from 'nersent-ui';

import { center } from '../../mixins/images';
import { invertColors } from '../../mixins/icons';

const searchIcon = require('../../icons/actions/search.svg');

export const StyledSearchInput = styled.div`
  width: calc(100% - 32px);
  max-width: 512px;
  height: 40px;
  position: absolute;
  left: 50%;
  border-radius: 20px;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background-color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px 0px #000;
  color: rgba(0, 0, 0, 0.87);
  font-size: 13px;
  padding-left: 16px;
  ${typography.robotoRegular()};

  &:focus {
    outline: none;
  }

  &::-webkit-input-placeholder {
    text-shadow: 0px 0px 0px rgba(0, 0, 0, ${transparency.light.text.secondary});
  }
`;

export const SearchIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 16px;
  background-image: url(${searchIcon});
  opacity: 0.54;
  ${center('100%', 'auto')};
`;
