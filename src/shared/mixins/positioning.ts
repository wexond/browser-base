import { css } from 'styled-components';

export const centerHorizontal = () => {
  return css`
    left: 50%;
    transform: translateX(-50%);
  `;
};

export const centerBoth = () => {
  return css`
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;
};

export const centerVertical = () => {
  return css`
    top: 50%;
    transform: translateY(-50%);
  `;
};
