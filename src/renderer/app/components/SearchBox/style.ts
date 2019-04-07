import styled from 'styled-components';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const StyledSearchBox = styled.div`
  margin-top: 10%;
  width: 700px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 23px;
  margin-bottom: 64px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

export const SearchIcon = styled.div`
  ${centerImage('18px', '18px')};
  background-image: url(${icons.search});
  height: 18px;
  filter: invert(100%);
  min-width: 18px;
  margin-left: 16px;
`;

export const Input = styled.input`
  height: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  margin-left: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.54);
  }
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
`;
