import styled, { css } from 'styled-components';
import images from '../../../shared/mixins/images';
import { Theme } from '../../../shared/models/theme';
import shadows from '../../../shared/mixins/shadows';

interface AddressBarProps {
  visible: boolean;
  suggestionsVisible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  transition: 0.2s opacity, 0.2s transform, 0.2s box-shadow, 0.2s border-radius;
  z-index: 10;
  max-width: 640px;
  left: 50%;
  overflow: hidden;
  background-color: white;

  ${({ suggestionsVisible, visible }: AddressBarProps) => css`
    height: ${suggestionsVisible ? 'auto' : '32px'};
    border-radius: ${suggestionsVisible ? 10 : 20}px;
    box-shadow: ${suggestionsVisible ? shadows(8) : 'none'};
    top: ${suggestionsVisible ? '4px' : 'calc(50% - 32px / 2)'};
    transform: translateX(-50%) ${visible ? 'scale(1)' : 'scale(1.1)'};
    opacity: ${visible ? 1 : 0};
    -webkit-app-region: ${visible ? 'no-drag' : ''};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

interface InputProps {
  visible: boolean;
  suggestionsVisible: boolean;
  theme?: Theme;
}

export const Input = styled.input`
  width: 100%;
  font-size: 13px;
  outline: none;
  border: none;
  position: relative;
  height: 32px;
  background-color: transparent;
  transition: 0.1s padding-left;

  ${({ suggestionsVisible, theme }: InputProps) => css`
    padding-left: ${suggestionsVisible ? '30px' : '16px'};
    ::placeholder {
      color: ${theme.addressBarInput.placeholderColor};
    }
  `};
`;

interface InputContainerProps {
  suggestionsVisible: boolean;
}

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  transition: 0.2s background-color;

  ${({ suggestionsVisible }: InputContainerProps) => css`
    height: ${suggestionsVisible ? '40px' : '32px'};
    background-color: ${suggestionsVisible ? 'white' : 'rgba(0, 0, 0, 0.06)'};
  `};
`;

interface IconProps {
  image: string;
}

export const Icon = styled.div`
  ${images.center('100%', '100%')};
  width: 20px;
  height: 20px;
  margin-left: 16px;
  opacity: 0.5;

  ${({ image }: IconProps) => css`
    background-image: url(${image});
  `};
`;
