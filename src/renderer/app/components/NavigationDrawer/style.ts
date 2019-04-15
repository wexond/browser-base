import styled from 'styled-components';
import { platform } from 'os';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';

export const StyledNavigationDrawer = styled.div`
  width: 300px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  position: fixed;
  left: 0;
`;

export const MenuItems = styled.div`
  margin-top: 24px;
`;

export const Header = styled.div`
  display: flex;
  margin-top: ${platform() === 'darwin' ? 48 : 32}px;
  margin-left: 32px;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 300;
`;

export const Back = styled.div`
  ${centerImage('24px', '24px')};
  background-image: url(${icons.arrowBack});
  height: 24px;
  width: 24px;
  opacity: 0.54;
  margin-right: 24px;
  filter: invert(100%);

  &:hover {
    opacity: 1;
  }
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
