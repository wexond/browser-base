import styled from 'styled-components';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const StyledSearchBox = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  width: 700px;
  z-index: 2;
  background-color: white;
  border-radius: 23px;
  transform: translateX(-50%);
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

export const SearchIcon = styled.div`
  ${centerImage('18px', '18px')};
  background-image: url(${icons.search});
  height: 18px;
  min-width: 18px;
  margin-left: 16px;
`;

export const Input = styled.input`
  height: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: black;
  font-size: 16px;
  margin-left: 16px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
`;
