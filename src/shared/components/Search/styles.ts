import styled from 'styled-components';
import { transparency, typography } from 'nersent-ui';
import { center } from '../../mixins/images';

const searchIcon = require('../../icons/search.svg');

export const StyledSearch = styled.div`
  width: 100%;
  max-width: 256px;
  height: 40px;
  position: absolute;
  right: 64px;
  border-radius: 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  font-size: 14px;
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
