import styled, { css } from 'styled-components';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const LeftMenu = styled.div`
  width: 300px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.12);
  position: fixed;
  left: 0;
`;

export const MenuItems = styled.div`
  margin-top: 24px;
`;

export const MenuItem = styled.div`
  padding: 0 16px;
  margin-left: 32px;
  margin-right: 32px;
  display: flex;
  height: 42px;
  align-items: center;
  position: relative;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 2px;
    height: 16px;
    background-color: white;

    ${({ selected }: { selected?: boolean }) => css`
      opacity: ${selected ? 1 : 0};
    `};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

export const Header = styled.div`
  display: flex;
  margin-top: 32px;
  margin-left: 32px;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 300;
`;

export const Sections = styled.div`
  margin-left: 300px;
  width: calc(100% - 300px);
  display: flex;
  flex-flow: column;
  align-items: center;
`;

export const Input = styled.input`
  border: none;
  outline: none;
  color: white;
  width: 100%;
  padding-left: 42px;
  background-color: transparent;
  height: 100%;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.54);
  }
`;

export const Search = styled.div`
  margin-left: 32px;
  margin-right: 32px;
  margin-top: 24px;
  height: 42px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.12);

  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    ${centerImage('16px', '16px')};
    background-image: url(${icons.search});
    filter: invert(100%);
  }
`;
