import styled from 'styled-components';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const StyledSearchBox = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  width: 700px;
  z-index: 2;
  background-color: white;
  border-radius: 20px;
  transform: translateX(-50%);
  display: flex;
  flex-flow: column;
`;

export const SearchIcon = styled.div`
  ${centerImage('16px', '16px')};
  background-image: url(${icons.search});
  height: 16px;
  min-width: 16px;
  margin-left: 16px;
`;

export const Input = styled.input`
  height: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: black;
  margin-left: 16px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
`;
