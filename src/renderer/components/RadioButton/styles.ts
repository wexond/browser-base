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

export const StyledRadioButton = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
  transition: 0.15s border-color;

  ${({ selected }: { selected: boolean }) => css`
    border: 2px solid ${selected ? colors.blue['500'] : 'rgba(0, 0, 0, 0.54)'};

    &::before {
      background-color: ${selected ? colors.blue['500'] : '#000'};
    }
  `}

  &::before {
    content: "";
    width: 0px;
    height: 0px;
    border-radius: 100%;
    display: block;
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transition: 0.1s width ${EASING_FUNCTION}, 0.1s height ${EASING_FUNCTION}, 0.15s opacity, 0.15s background-color;
    ${centerBoth()};
  }
`;

export const Circle = styled.div`
  border-radius: 100%;
  box-sizing: border-box;
  background-color: ${colors.blue['500']};
  position: absolute;
  pointer-events: none;
  transition: 0.15s width ${EASING_FUNCTION}, 0.15s height ${EASING_FUNCTION};
  ${centerBoth()};

  ${({ selected }: { selected: boolean }) => css`
    width: ${selected ? 9 : 0}px;
    height: ${selected ? 9 : 0}px;
  `}
`

export const Label = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, ${transparency.text.high});
  margin-left: 8px;
  ${robotoRegular()};
`;
