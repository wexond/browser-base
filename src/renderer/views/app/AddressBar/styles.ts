import styled, { css } from 'styled-components';
import shadows from '../../../mixins/shadows';
import opacity from '../../../defaults/opacity';
import images from '../../../mixins/images';

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
  will-change: opacity, transform, box-shadow, border-radius, transition;

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

export const Input = styled.input`
  width: 100%;
  font-size: 13px;
  outline: none;
  border: none;
  position: relative;
  height: 32px;
  background-color: transparent;
  transition: 0.1s padding-left;

  ::placeholder {
    color: rgba(0, 0, 0, ${opacity.light.disabledText});
  }

  ${({ suggestionsVisible }: { suggestionsVisible: boolean }) => css`
    padding-left: ${suggestionsVisible ? '30px' : '16px'};
  `};
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  transition: 0.2s background-color;

  ${({ suggestionsVisible }: { suggestionsVisible: boolean }) => css`
    height: ${suggestionsVisible ? '40px' : '32px'};
    background-color: ${suggestionsVisible ? 'white' : 'rgba(0, 0, 0, 0.06)'};
  `};
`;

export const Icon = styled.div`
  ${images.center('100%', '100%')};
  width: 20px;
  height: 20px;
  margin-left: 16px;
  opacity: 0.5;

  ${({ image }: { image: string }) => css`
    background-image: url(${image});
  `};
`;
