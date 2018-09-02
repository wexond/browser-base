import styled, { css } from 'styled-components';

import { ADDRESS_BAR_HEIGHT } from '@/constants/app';
import { shadows, centerImage } from '@/mixins';
import { transparency } from '@/constants/renderer';

interface AddressBarProps {
  visible: boolean;
  suggestionsVisible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  transition: 0.3s opacity, 0.2s transform;
  z-index: 10;
  max-width: 640px;
  left: calc(50% + 4px);
  overflow: hidden;
  background-color: white;
  will-change: transition, opacity;

  ${({ suggestionsVisible, visible }: AddressBarProps) => css`
    height: ${suggestionsVisible ? 'auto' : `${ADDRESS_BAR_HEIGHT}px`};
    border-radius: ${suggestionsVisible ? 8 : 20}px;
    box-shadow: ${suggestionsVisible ? shadows(8) : 'none'};
    top: ${suggestionsVisible
      ? '1px'
      : `calc(50% - ${ADDRESS_BAR_HEIGHT}px / 2)`};
    transform: translateX(-50%) ${visible ? '' : 'translateY(-30px)'};
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
  height: 30px;
  background-color: transparent;
  transition: 0.1s padding-left;

  ::placeholder {
    color: rgba(0, 0, 0, ${transparency.light.disabledText});
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
    height: ${suggestionsVisible ? 40 : ADDRESS_BAR_HEIGHT}px;
    background-color: ${suggestionsVisible ? 'white' : 'rgba(0, 0, 0, 0.06)'};
  `};
`;

export const Icon = styled.div`
  ${centerImage('100%', '100%')};
  width: 20px;
  height: 20px;
  margin-left: 16px;
  opacity: 0.5;

  ${({ image }: { image: string }) => css`
    background-image: url(${image});
  `};
`;
