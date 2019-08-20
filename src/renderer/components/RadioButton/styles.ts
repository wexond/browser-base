import styled, { css } from 'styled-components';

import { colors, EASING_FUNCTION, transparency, } from '~/renderer/constants';
import { centerBoth, robotoRegular } from '~/renderer/mixins';

export const Container = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

  &:hover .radio-button::before {
    width: 36px;
    height: 36px;
    opacity: 0.08;
  }
`;


export const Circle = styled.div`
  background: ${selected => selected ? colors.blue['500'] : 'rgba(0, 0, 0, 0.54)'};
  width: 0;
  height: 0;
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease-in, height 0.2s ease-in;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: "";
    opacity: 0;
    width: calc(20px - 4px);
    position: absolute;
    height: calc(20px - 4px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid
    ${selected => selected ? colors.blue['500'] : 'rgba(0, 0, 0, 0.54)'};
    border-radius: 100%;
  }
`;

export const Root = styled.div`
  margin: 5px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  position: relative;
  label {
    margin-left: 25px;
  }
  &::before {
    content: "";
    border-radius: 100%;
    border: 1px solid #DDD
    background: #FAFAFA;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 0;
  }
`;


export const Radio = styled.input`
opacity: 0;
z-index: 2;
position: absolute;
top: 0;
width: 100%;
height: 100%;
margin: 0;
cursor: pointer;

&:focus {
  outline: none;
}

&:checked {
  & ~ ${Circle} {
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    transition: width 0.2s ease-out, height 0.2s ease-out;

    &::before {
      opacity: 1;
      transition: opacity 1s ease;
    }
  }
}
`;

export const Label = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, ${transparency.text.high});
  margin-left: 8px;
  ${robotoRegular()};
`;
