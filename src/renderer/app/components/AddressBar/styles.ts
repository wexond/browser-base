import styled, { css } from 'styled-components';

import { ADDRESS_BAR_HEIGHT, TOOLBAR_HEIGHT } from '@/constants/app';
import { shadows, centerImage } from '@/mixins';
import { transparency } from '@/constants/renderer';

export const StyledAddressBar = styled.div`
  position: absolute;
  transition: 0.3s opacity;
  z-index: 9999;
  width: 652px;
  top: 48px;
  left: 50%;
  background-color: white;
  box-shadow: ${shadows(6)};
  border-radius: 4px;
  transition: 0.2s opacity, 0.2s transform;
  padding-bottom: 8px;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
    transform: ${visible ? 'translate(-50%, 0)' : 'translate(-50%, -20px)'};
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
  padding-left: 20px;

  ::placeholder {
    color: rgba(0, 0, 0, ${transparency.light.disabledText});
  }
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  margin: 8px;
  position: relative;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.06);
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
