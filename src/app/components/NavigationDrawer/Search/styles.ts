import styled from 'styled-components';
import images from '../../../../shared/mixins/images';

const searchIcon = require('../../../../shared/icons/search.svg');

export const StyledSearch = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  height: 51px;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const Input = styled.input`
  background-color: none;
  outline: none;
  font-size: 14px;
  border: none;
  padding-left: 16px;
  width: 100%;
  height: 100%;
`;

export const Icon = styled.div`
  ${images.center('24px', 'auto')};
  opacity: 0.54;
  height: 24px;
  width: 24px;
  margin-left: 16px;
  background-image: url(${searchIcon});
`;
