import { transparency } from 'nersent-ui';
import styled from 'styled-components';
import { Theme } from '../../models/theme';

interface AddressBarProps {
  visible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: 0.2s opacity;
  display: flex;
  z-index: 10;
  align-items: center;

  opacity: ${(props: AddressBarProps) => (props.visible ? 1 : 0)};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

interface InputProps {
  visible: boolean;
  theme?: Theme;
}

export const Input = styled.input`
  border-radius: 20px;
  width: calc(100% - 18px);
  font-size: 13px;
  padding-left: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  position: relative;

  -webkit-app-region: ${(props: InputProps) => (props.visible ? 'no-drag' : 'drag')};
  ::placeholder {
    color: ${(props: InputProps) => props.theme.searchBar.placeholderColor};
  }
  background-color: white;
  height: 32px;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  left: 50%;
  transform: translateX(-50%);
`;
